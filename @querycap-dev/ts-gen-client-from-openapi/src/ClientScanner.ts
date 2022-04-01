import { ISchemaBasic, Scanner } from "@querycap-dev/ts-gen-definitions-from-json-schema";
import { IOpenAPI, IOperation, IRequestBody, IResponse, IResponses, ISchema, TParameter } from "./OpenAPI";
import {
  Decl,
  Identifier,
  isIdentifier,
  ModuleImport,
  toLowerCamelCase,
  Value,
  Writer,
} from "@querycap-dev/ts-gen-core";
import { assign, concat, filter, first, forEach, map, reduce, toUpper, values } from "@querycap/lodash";

interface Dictionary<T> {
  [k: string]: T;
}

export interface IClientOpts {
  clientId: string;
  clientLib: {
    path: string;
    method: string;
  };
}

export const mayToId = (id: string): string => (isIdentifier(id) ? id : toLowerCamelCase(id));

export const mayToAliasID = (id: string) => mayToId(`p-${id}`);

export const urlToTemplate = (url = "") =>
  `\`${url.replace(/\{([^}]+)\}/g, (_, $1): string => {
    return `\${${mayToAliasID($1)}}`;
  })}\``;

export const filterParametersIn = (position: string) => {
  return (parameters: any[]): any[] => filter(parameters, (parameter: any): boolean => parameter.in === position);
};

class ClientBuilder extends Scanner {
  constructor(writer: Writer, protected opts: IClientOpts) {
    super(writer);
  }

  scanClient(openAPI: IOpenAPI) {
    this.$root = openAPI;

    this.importClientLib();

    forEach(openAPI.paths, (pathItem, path: string) =>
      forEach(pathItem, (operation, method) => {
        this.scanOperation(method, path, operation);
      }),
    );
  }

  scanOperation(method: string, path: string, operation: IOperation) {
    const operationUiq = `${this.opts.clientId}.${operation.operationId}`;
    const params: TParameter[] = (map(operation.parameters, (v) => v) || []) as TParameter[];

    const members = [
      Identifier.of("method").valueOf(Value.of(toUpper(method))),
      Identifier.of("url").valueOf(new Value(urlToTemplate(path))),
    ];

    let bodyContentType = "";

    if (operation.requestBody) {
      for (const contentType in (operation.requestBody as IRequestBody).content) {
        const mediaType = (operation.requestBody as IRequestBody).content[contentType];

        if (mediaType.schema) {
          bodyContentType = contentType;

          params.push({
            in: "body",
            name: "body",
            required: true,
            schema: mediaType.schema,
          } as any);

          members.push(Identifier.of("data").valueOf(Identifier.of(mayToAliasID("body"))));
        }

        break;
      }
    }

    const query = filterParametersIn("query")(operation.parameters as TParameter[]);

    if (query.length) {
      members.push(Identifier.of("query").valueOf(this.createParameterObject(query)));
    }

    const headers = filterParametersIn("header")(operation.parameters as TParameter[]);

    if (headers.length || bodyContentType) {
      let parametersForHeader = headers;

      if (bodyContentType) {
        parametersForHeader = parametersForHeader.concat({
          name: "Content-Type",
          value: bodyContentType,
        });
      }

      members.push(Identifier.of("headers").valueOf(this.createParameterObject(parametersForHeader)));
    }

    this.writer.write(
      Decl.const(
        Identifier.of(toLowerCamelCase(operation.operationId || "")).valueOf(
          this.callFuncOf(operationUiq, params, this.getRespBodySchema(operation.responses), members),
        ),
      ),
    );
  }

  callFuncOf(operationUiq: string, parameters: TParameter[], respBodySchema: ISchema, members: Identifier[]) {
    let callbackFunc = Identifier.of("").operatorsWith(": ", " => ");

    if (parameters.length) {
      callbackFunc = callbackFunc.paramsWith(Identifier.of(String(this.createParameterObject(parameters))));
    } else {
      callbackFunc = callbackFunc.paramsWith(Identifier.of(""));
    }

    callbackFunc = callbackFunc.valueOf(
      Value.memberOf(Decl.returnOf(Identifier.of(String(Value.objectOf(...members))))),
    );

    return Identifier.of(this.opts.clientLib.method)
      .generics(
        parameters.length ? this.toType(this.getReqParamSchema(parameters)) : Identifier.of("void"),
        this.toType(respBodySchema as ISchemaBasic),
      )
      .paramsWith(Identifier.of(String(Value.of(operationUiq))), callbackFunc);
  }

  createParameterObject = (parameters: TParameter[]) =>
    Value.objectOf(
      ...map(parameters, (parameter) => {
        if (parameter.value) {
          return Identifier.of(String(Value.of(parameter.name))).valueOf(Value.of(parameter.value));
        }
        const propName = mayToId(parameter.name || "");
        if (propName !== parameter.name) {
          return Identifier.of(String(Value.of(parameter.name))).valueOf(Identifier.of(mayToAliasID(propName)));
        }
        return Identifier.of(parameter.name).valueOf(Identifier.of(mayToAliasID(propName)));
      }),
    );

  getReqParamSchema = (parameters: TParameter[]): ISchemaBasic => {
    return {
      type: "object",
      properties: reduce(
        parameters,
        (properties: Dictionary<ISchema>, parameter: TParameter) => {
          const schema = parameter.schema;

          let propName = mayToId(parameter.name || "");

          if (parameter.name !== propName) {
            propName = parameter.name || "";
          }

          return assign(properties, {
            [propName]: schema,
          });
        },
        {},
      ) as Dictionary<ISchemaBasic>,
      required: this.pickRequiredList(parameters),
    };
  };

  pickRequiredList = (parameters: TParameter[]): string[] =>
    reduce(
      parameters,
      (result: string[], parameter: TParameter): string[] => {
        if (parameter.required && parameter.name) {
          return concat(result, parameter.name);
        }
        return result;
      },
      ["body"] as string[],
    );

  getRespBodySchema = (responses: IResponses) => {
    let bodySchema: ISchema = { type: "null" } as any;

    forEach(responses, (resp: IResponse, codeOrDefault) => {
      const code = Number(codeOrDefault);
      if (code >= 200 && code < 300 && resp.content) {
        const mediaType = first(values(resp.content));
        if (mediaType && mediaType.schema) {
          bodySchema = mediaType.schema;
        }
      }
    });

    return bodySchema;
  };

  importClientLib() {
    this.writer.import(
      ModuleImport.from(this.opts.clientLib.path).membersAs(Identifier.of(this.opts.clientLib.method)),
    );
  }
}

export const clientScanner = (writer: Writer, openAPI: IOpenAPI, opts: IClientOpts) => {
  return new ClientBuilder(writer, opts).scanClient(openAPI);
};

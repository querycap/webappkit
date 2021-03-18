import { assign, drop, forEach, get, has, isBoolean, isString, replace, split } from "lodash";
import { ISchemaBasic, TSchema } from "./Schema";
import { isMetaType, normalizeSchema } from "./utils";

export interface IImports {
  [k: string]: ISchemaBasic;
}

const rename = (schemaBasic: ISchemaBasic, from: string, to: string) => {
  if ((schemaBasic as any)[from]) {
    (schemaBasic as any)[to] = (schemaBasic as any)[from];
    delete (schemaBasic as any)[from];
  }
};

const migrateSchema = (schemaBasic: ISchemaBasic) => {
  rename(schemaBasic, "id", "$id");

  if ((schemaBasic as any).definitions) {
    schemaBasic.$defs = (schemaBasic as any).definitions;
    delete (schemaBasic as any).definitions;
  }

  if (isString(schemaBasic.$ref)) {
    if (schemaBasic.$ref === "#") {
      schemaBasic.$recursiveRef = "#";
      delete schemaBasic.$ref;
    } else if (schemaBasic.$ref) {
      schemaBasic.$ref = replace(schemaBasic.$ref, /\/definitions/g, "/$defs");
    }
  }

  if (isBoolean(schemaBasic.exclusiveMaximum) && has(schemaBasic, "maximum")) {
    schemaBasic.exclusiveMaximum = schemaBasic.maximum;
    delete schemaBasic.maximum;
  }

  if (isBoolean(schemaBasic.exclusiveMinimum) && has(schemaBasic, "minimum")) {
    schemaBasic.exclusiveMinimum = schemaBasic.minimum;
    delete schemaBasic.minimum;
  }
};

function resolveRef(ref: string, externals: IImports, rootSchema: ISchemaBasic): ISchemaBasic {
  const [externalKey, keyPath] = split(ref, "#");
  const keyPathArr = drop(split(keyPath, "/"));

  let baseSchema = rootSchema;

  if (externalKey) {
    if (!has(externals, externalKey)) {
      throw new Error(`missing external for ${externalKey}`);
    }
    baseSchema = externals[externalKey];
  }

  const subSchema = get(baseSchema, keyPathArr) as ISchemaBasic;

  if (subSchema.$ref) {
    return resolveRef(subSchema.$ref, externals, baseSchema);
  }

  return subSchema;
}

const preprocess = (rootSchema: ISchemaBasic, externals: IImports) => (schema: ISchemaBasic, next: () => void) => {
  migrateSchema(schema);

  if (isString(schema.$ref)) {
    if (schema.$ref[0] !== "#") {
      // process externals
      assign(schema, resolveRef(schema.$ref, externals, rootSchema));
      delete schema.$ref;
    } else {
      const [, keyPath] = split(schema.$ref, "#");
      const keyPathArr = drop(split(keyPath, "/"));
      const refSchema = get(rootSchema, keyPathArr) as ISchemaBasic;
      if (isMetaType(refSchema)) {
        assign(schema, refSchema);
        delete schema.$ref;
      }
    }
  }

  next();
};

const walkSchema = (schema: TSchema, cb: (schema: ISchemaBasic, next: () => void) => void) => {
  const schemaObj = normalizeSchema(schema);

  function nextIfExists(subSchema?: TSchema) {
    if (subSchema && subSchema !== false) {
      walkSchema(subSchema, cb);
    }
  }

  function next() {
    if (schemaObj.items) {
      ([] as TSchema[]).concat(schemaObj.items).forEach(nextIfExists);
    }

    [
      schemaObj.oneOf,
      schemaObj.anyOf,
      schemaObj.allOf,

      schemaObj.properties,
      schemaObj.patternProperties,
      schemaObj.$defs,
    ].forEach((schemas) => forEach(schemas as any, nextIfExists));

    [
      schemaObj.not,

      schemaObj.additionalProperties,
      schemaObj.unevaluatedProperties,
      schemaObj.propertyNames,

      schemaObj.additionalItems,
      schemaObj.unevaluatedItems,
    ].forEach(nextIfExists);
  }

  cb(schemaObj, next);
};

export const simplifySchema = (schema: ISchemaBasic, imports: IImports): ISchemaBasic => {
  walkSchema(schema, preprocess(schema, imports));
  return schema;
};

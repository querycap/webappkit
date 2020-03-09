import { StatusBadGateway, StatusClientClosedRequest, StatusConnectionClosedWithoutResponse } from "@reactorx/request";
import axios, { AxiosError, AxiosInterceptorManager, AxiosResponse } from "axios";
import { reduce } from "lodash";

export interface IStatusError {
  canBeTalkError: boolean;
  code: number;
  desc: string;
  key: string;
  errorFields: IErrorField[];
  id: string;
  msg: string;
  source: string[];
}

export interface IErrorField {
  field: string;
  in: string;
  msg: string;
}

export function errorPatch(_: any, response: AxiosInterceptorManager<AxiosResponse>) {
  response.use(
    (resp) => resp,
    (err) => {
      throw patchError(err);
    },
  );
}

function patchError(error: AxiosError): AxiosResponse<IStatusError> {
  if (axios.isCancel(error)) {
    return {
      ...error.response!,
      data: {
        code: StatusClientClosedRequest,
        key: "ClientClosedRequest",
        msg: "请求已取消",
        desc: "",
        errorFields: [],
        id: "",
        canBeTalkError: false,
        source: [],
      } as IStatusError,
    };
  }

  const defaultError: IStatusError = {
    code: StatusBadGateway,
    key: "BadGateway",
    msg: "网络错误",
    desc: "",
    errorFields: [],
    id: "",
    canBeTalkError: true,
    source: [],
  };

  if (!error.response) {
    const data = {
      ...defaultError,
      code: StatusConnectionClosedWithoutResponse,
      key: "ConnectionClosedWithoutResponse",
    };

    return {
      config: {},
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      data: data,
      statusText: data.key,
      status: data.code,
    };
  }

  if (error.response.status === StatusBadGateway) {
    return {
      ...error.response,
      data: defaultError,
    };
  }

  return error.response;
}

export function pickErrors(errorFields: IErrorField[] = []) {
  return reduce<IErrorField, { [field: string]: string }>(
    errorFields,
    (errors, error) => ({
      ...errors,
      [error.field]: error.msg,
    }),
    {},
  );
}

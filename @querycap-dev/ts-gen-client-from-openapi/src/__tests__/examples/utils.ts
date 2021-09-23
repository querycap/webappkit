export type IMethod = "GET" | "DELETE" | "HEAD" | "POST" | "PUT" | "PATCH";

export interface IRequestOptions {
  method: IMethod;
  url: string;
  query?: any;
  headers?: any;
  data?: any;
  formData?: any;
}

export function createRequest<TReq, TRespBody>(_: string, _2: (req: TReq) => IRequestOptions) {
  return (_3: TReq): Promise<TRespBody> => Promise.resolve({} as TRespBody);
}

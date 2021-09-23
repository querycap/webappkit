export type IMethod = "GET" | "DELETE" | "HEAD" | "POST" | "PUT" | "PATCH";

export interface IRequestOptions {
  method: IMethod;
  url: string;
  query?: any;
  headers?: any;
  data?: any;
}

export const createRequest =
  <TReq, TRespBody>(_: string, _2: (req: TReq) => IRequestOptions) =>
  (_3: TReq): Promise<TRespBody> =>
    Promise.resolve({} as TRespBody);

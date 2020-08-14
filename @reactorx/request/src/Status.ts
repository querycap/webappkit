export type Status = number;

export const StatusContinue: Status = 100; // RFC 7231; 6.2.1
export const StatusSwitchingProtocols: Status = 101; // RFC 7231; 6.2.2
export const StatusProcessing: Status = 102; // RFC 2518; 10.1

export const StatusOK: Status = 200; // RFC 7231; 6.3.1
export const StatusCreated: Status = 201; // RFC 7231; 6.3.2
export const StatusAccepted: Status = 202; // RFC 7231; 6.3.3
export const StatusNonAuthoritativeInfo: Status = 203; // RFC 7231; 6.3.4
export const StatusNoContent: Status = 204; // RFC 7231; 6.3.5
export const StatusResetContent: Status = 205; // RFC 7231; 6.3.6
export const StatusPartialContent: Status = 206; // RFC 7233; 4.1
export const StatusMulti: Status = 207; // RFC 4918; 11.1
export const StatusAlreadyReported: Status = 208; // RFC 5842; 7.1
export const StatusIMUsed: Status = 226; // RFC 3229; 10.4.1

export const StatusMultipleChoices: Status = 300; // RFC 7231; 6.4.1
export const StatusMovedPermanently: Status = 301; // RFC 7231; 6.4.2
export const StatusFound: Status = 302; // RFC 7231; 6.4.3
export const StatusSeeOther: Status = 303; // RFC 7231; 6.4.4
export const StatusNotModified: Status = 304; // RFC 7232; 4.1
export const StatusUseProxy: Status = 305; // RFC 7231; 6.4.5
export const Status_: Status = 306; // RFC 7231; 6.4.6;(Unused)
export const StatusTemporaryRedirect: Status = 307; // RFC 7231; 6.4.7
export const StatusPermanentRedirect: Status = 308; // RFC 7538; 3

export const StatusBadRequest: Status = 400; // RFC 7231; 6.5.1
export const StatusUnauthorized: Status = 401; // RFC 7235; 3.1
export const StatusPaymentRequired: Status = 402; // RFC 7231; 6.5.2
export const StatusForbidden: Status = 403; // RFC 7231; 6.5.3
export const StatusNotFound: Status = 404; // RFC 7231; 6.5.4
export const StatusMethodNotAllowed: Status = 405; // RFC 7231; 6.5.5
export const StatusNotAcceptable: Status = 406; // RFC 7231; 6.5.6
export const StatusProxyAuthRequired: Status = 407; // RFC 7235; 3.2
export const StatusRequestTimeout: Status = 408; // RFC 7231; 6.5.7
export const StatusConflict: Status = 409; // RFC 7231; 6.5.8
export const StatusGone: Status = 410; // RFC 7231; 6.5.9
export const StatusLengthRequired: Status = 411; // RFC 7231; 6.5.10
export const StatusPreconditionFailed: Status = 412; // RFC 7232; 4.2
export const StatusRequestEntityTooLarge: Status = 413; // RFC 7231; 6.5.11
export const StatusRequestURITooLong: Status = 414; // RFC 7231; 6.5.12
export const StatusUnsupportedMediaType: Status = 415; // RFC 7231; 6.5.13
export const StatusRequestedRangeNotSatisfiable: Status = 416; // RFC 7233; 4.4
export const StatusExpectationFailed: Status = 417; // RFC 7231; 6.5.14
export const StatusTeapot: Status = 418; // RFC 7168; 2.3.3
export const StatusUnprocessableEntity: Status = 422; // RFC 4918; 11.2
export const StatusLocked: Status = 423; // RFC 4918; 11.3
export const StatusFailedDependency: Status = 424; // RFC 4918; 11.4
export const StatusUpgradeRequired: Status = 426; // RFC 7231; 6.5.15
export const StatusPreconditionRequired: Status = 428; // RFC 6585; 3
export const StatusTooManyRequests: Status = 429; // RFC 6585; 4
export const StatusRequestHeaderFieldsTooLarge: Status = 431; // RFC 6585; 5

export const StatusConnectionClosedWithoutResponse: Status = 444; // https://httpstatuses.com/444

export const StatusUnavailableForLegalReasons: Status = 451; // RFC 7725; 3

export const StatusClientClosedRequest: Status = 499; // https://httpstatuses.com/499

export const StatusInternalServerError: Status = 500; // RFC 7231; 6.6.1
export const StatusNotImplemented: Status = 501; // RFC 7231; 6.6.2
export const StatusBadGateway: Status = 502; // RFC 7231; 6.6.3
export const StatusServiceUnavailable: Status = 503; // RFC 7231; 6.6.4
export const StatusGatewayTimeout: Status = 504; // RFC 7231; 6.6.5
export const StatusHTTPVersionNotSupported: Status = 505; // RFC 7231; 6.6.6
export const StatusVariantAlsoNegotiates: Status = 506; // RFC 2295; 8.1
export const StatusInsufficientStorage: Status = 507; // RFC 4918; 11.5
export const StatusLoopDetected: Status = 508; // RFC 5842; 7.2
export const StatusNotExtended: Status = 510; // RFC 2774; 7
export const StatusNetworkAuthenticationRequired: Status = 511; // RFC 6585; 6

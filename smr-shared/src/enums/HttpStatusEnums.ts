export enum HttpStatusCodes {
  // 1xx: Informational
  Continue = 100, // Server received headers; client should proceed with body
  SwitchingProtocols = 101, // Switching protocols (e.g., upgrading to WebSockets)
  Processing = 102, // Server accepted request but hasn't completed it yet

  // 2xx: Success
  Ok = 200, // Request succeeded; standard successful response
  Created = 201, // Request succeeded and a new resource was created
  Accepted = 202, // Request accepted for processing, but not yet complete
  NonAuthoritativeInformation = 203, // Returned payload is modified from origin server's 200
  NoContent = 204, // Request succeeded, but there is no content to return
  ResetContent = 205, // Request succeeded; tells client to reset the document view
  PartialContent = 206, // Used for range requests (e.g., streaming video/audio)

  // 3xx: Redirection
  MultipleChoices = 300, // Request has more than one possible response
  MovedPermanently = 301, // Resource has been assigned a new permanent URI
  Found = 302, // Resource resides temporarily under a different URI
  SeeOther = 303, // Redirects client to get resource at another URI via GET
  NotModified = 304, // Resource hasn't changed; client can use cached version
  TemporaryRedirect = 307, // Resource is temporarily at another URI; keep same HTTP method
  PermanentRedirect = 308, // Resource is permanently at another URI; keep same HTTP method

  // 4xx: Client Errors
  BadRequest = 400, // Server cannot process request due to client error (e.g., bad syntax)
  Unauthorized = 401, // Client must authenticate itself to get the response
  PaymentRequired = 402, // Reserved for future use (sometimes used for digital payments)
  Forbidden = 403, // Client authenticated but does not have access rights
  NotFound = 404, // Server cannot find the requested resource
  MethodNotAllowed = 405, // HTTP method is known but not supported by the resource
  NotAcceptable = 406, // Server cannot produce a response matching Accept headers
  ProxyAuthenticationRequired = 407, // Authentication is needed via a proxy
  RequestTimeout = 408, // Server timed out waiting for the request from client
  Conflict = 409, // Request conflicts with current state of the server
  Gone = 410, // Resource is permanently deleted and will not return
  LengthRequired = 411, // Server refuses request without a defined Content-Length
  PreconditionFailed = 412, // Client put preconditions in headers that server didn't meet
  PayloadTooLarge = 413, // Request entity is larger than limits defined by server
  UriTooLong = 414, // URI requested by the client is longer than server will interpret
  UnsupportedMediaType = 415, // Media format of requested data is not supported by server
  RangeNotSatisfiable = 416, // Range specified by Range header in request cannot be fulfilled
  ExpectationFailed = 417, // Expect header indication cannot be met by the server
  ImATeapot = 418, // April Fools joke; server refuses to brew coffee in a teapot
  UnprocessableEntity = 422, // Request was well-formed but has semantic errors (validation failed)
  Locked = 423, // Resource that is being accessed is locked
  FailedDependency = 424, // Request failed due to failure of a previous request
  TooManyRequests = 429, // Client has sent too many requests in a given time (rate limiting)

  // 5xx: Server Errors
  InternalServerError = 500, // Server encountered an unhandled situation it doesn't know how to fix
  NotImplemented = 501, // Server does not support the functionality required to fulfill request
  BadGateway = 502, // Server acting as gateway got an invalid response from upstream server
  ServiceUnavailable = 503, // Server is not ready to handle request (overloaded or down for maintenance)
  GatewayTimeout = 504, // Server acting as gateway timed out waiting for upstream server
  HttpVersionNotSupported = 505, // HTTP version used in the request is not supported by the server
  InsufficientStorage = 507, // Server cannot store the representation needed to complete request
  NetworkAuthenticationRequired = 511, // Client needs to authenticate to gain network access (e.g., Wi-Fi portal)
}

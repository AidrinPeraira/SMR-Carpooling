export enum ErrorCode {
  // --- System/Infrastructure Errors (Technical) ---
  SYSTEM_INTERNAL_ERROR = "ERR_SYSTEM_INTERNAL_ERROR",
  SYSTEM_DB_ERROR = "ERR_SYSTEM_DB_FAILURE",
  SYSTEM_BROKER_ERROR = "ERR_SYSTEM_BROKER_FAILURE",
  SYSTEM_UNAVAILABLE = "ERR_SYSTEM_SERVICE_UNAVAILABLE",

  // --- Domain/Business Errors (Logic) ---
  DOMAIN_NOT_FOUND = "ERR_DOMAIN_RESOURCE_NOT_FOUND",
  DOMAIN_ALREADY_EXISTS = "ERR_DOMAIN_ALREADY_EXISTS",
  DOMAIN_ACCESS_DENIED = "ERR_DOMAIN_ACCESS_DENIED",
  DOMAIN_CONFLICT = "ERR_DOMAIN_CONFLICT",

  // --- Input/Request Errors (Interface) ---
  INPUT_VALIDATION_ERROR = "ERR_INPUT_VALIDATION_FAILED",
  INPUT_UNAUTHORIZED = "ERR_INPUT_UNAUTHORIZED",
  INPUT_FORBIDDEN = "ERR_INPUT_FORBIDDEN",
  INPUT_TOKEN_EXPIRED = "ERR_INPUT_TOKEN_EXPIRED",
}

export enum ErrorDetails {
  // --- System/Infrastructure Errors ---
  SYSTEM_INTERNAL_ERROR = "Internal Server Error: An unexpected technical failure occurred.",
  SYSTEM_DB_ERROR = "Database Failure: Unable to perform the requested data operation.",
  SYSTEM_BROKER_ERROR = "Message Broker Failure: Communication with the event bus failed.",
  SYSTEM_UNAVAILABLE = "Service Unavailable: The system or a dependent service is currently down.",

  // --- Domain/Business Errors ---
  DOMAIN_NOT_FOUND = "Domain Error: The requested business resource was not found.",
  DOMAIN_ALREADY_EXISTS = "Domain Conflict: A resource with these details already exists.",
  DOMAIN_ACCESS_DENIED = "Domain Permission Denied: You do not have the required business permissions.",
  DOMAIN_CONFLICT = "Domain Conflict: The operation contradicts the current business state.",

  // --- Input/Request Errors ---
  INPUT_VALIDATION_ERROR = "Invalid Input Data: The request payload failed validation rules.",
  INPUT_UNAUTHORIZED = "Authentication Required: You must be logged in to perform this action.",
  INPUT_FORBIDDEN = "Access Denied: Your account does not have access to this endpoint.",
  INPUT_TOKEN_EXPIRED = "Session Expired: Your authentication token is no longer valid.",
}

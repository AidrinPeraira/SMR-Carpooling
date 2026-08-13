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
  SYSTEM_INTERNAL_ERROR = "An unexpected technical failure occurred.",
  SYSTEM_DB_ERROR = "Unable to perform the requested database operation.",
  SYSTEM_BROKER_ERROR = "Communication with the event bus failed.",
  SYSTEM_UNAVAILABLE = "The system or service is currently down.",

  // --- Domain/Business Errors ---
  DOMAIN_NOT_FOUND = "The requested resource was not found.",
  DOMAIN_ALREADY_EXISTS = "A resource with these details already exists.",
  DOMAIN_ACCESS_DENIED = " You do not have the required permissions.",
  DOMAIN_CONFLICT = "The operation conflicts with the current state.",

  // --- Input/Request Errors ---
  INPUT_VALIDATION_ERROR = "The data provided is invalid.",
  INPUT_UNAUTHORIZED = " You are not authorized to perform this action.",
  INPUT_FORBIDDEN = "This action is not allowed.",
  INPUT_TOKEN_EXPIRED = "Your current session is no longer valid.",
}

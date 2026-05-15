export enum ErrorCode {
  DB_ERROR = 'ERR_DATABASE_FAILURE',
  VALIDATION_ERROR = 'ERR_VALIDATION_FAILED',
  UNAUTHORIZED = 'ERR_UNAUTHORIZED',
  FORBIDDEN = 'ERR_FORBIDDEN',
  TOKEN_EXPIRED = 'ERR_TOKEN_EXPIRED',

  // --- Network & System Errors ---
  NOT_FOUND = 'ERR_RESOURCE_NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'ERR_INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'ERR_SERVICE_UNAVAILABLE',
}

export enum ErrorDetails {
  DB_ERROR = 'Database Failure',
  VALIDATION_ERROR = 'Invalid Input Data',
  UNAUTHORIZED = 'Authentication Required',
  FORBIDDEN = 'Access Denied',
  TOKEN_EXPIRED = 'Session Expired',

  // --- Network & System Errors ---
  NOT_FOUND = 'Resource Not Found',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  SERVICE_UNAVAILABLE = 'Service Temporarily Unavailable',
}

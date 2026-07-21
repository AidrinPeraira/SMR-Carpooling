export enum GenericSuccessMessage {
  OPERATION_SUCCESSFUL = "Operation completed successfully.",
  RESOURCE_DELETED = "The requested resource has been deleted.",
}

export enum GenericErrorMessage {
  INTERNAL_SERVER_ERROR = "An unexpected error occurred. Please try again later.",
  BAD_REQUEST = "The request is invalid or cannot be served.",
  UNAUTHORIZED = "You do not have permission to perform this action.",
  FORBIDDEN = "Access to this resource is denied.",
  VALIDATION_ERROR = "The provided data is invalid or malformed.",
  NOT_FOUND = "The requested resource could not be found.",
  CONFLICT = "The request could not be completed due to a conflict with the current state of the resource",
  TOO_MANY_REQUESTS = "Rate limit exceeded. Please slow down.",
  BROKER_ERROR = "Communication with the internal messaging system failed.",
  SERVICE_UNAVAILABLE = "The service is temporarily unavailable. Please try again later.",
}

import {
  ApplicationError,
  HttpStatusCodes,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
} from "@sharemyride/shared";

export const mapError = (err: unknown): ApplicationError => {
  // If it's already an ApplicationError, return it
  if (err instanceof ApplicationError) {
    return err;
  }

  // Zod Validation Errors
  if ((err as any)?.name === "ZodError") {
    return new ApplicationError(
      GenericErrorMessage.VALIDATION_ERROR,
      HttpStatusCodes.UnprocessableEntity,
      ErrorCode.INPUT_VALIDATION_ERROR,
      (err as any).issues,
      err,
    );
  }

  // RabbitMQ / amqplib Errors
  if (
    (err as any)?.name === "AmqpLibError" ||
    // eslint-disable-next-line
    (err as any)?.stack?.includes("amqplib")
  ) {
    if ((err as any).code === "ECONNREFUSED") {
      return new ApplicationError(
        GenericErrorMessage.SERVICE_UNAVAILABLE,
        HttpStatusCodes.ServiceUnavailable,
        ErrorCode.SYSTEM_UNAVAILABLE,
        ErrorDetails.SYSTEM_UNAVAILABLE,
        err,
      );
    }

    return new ApplicationError(
      GenericErrorMessage.BROKER_ERROR,
      HttpStatusCodes.InternalServerError,
      ErrorCode.SYSTEM_BROKER_ERROR,
      ErrorDetails.SYSTEM_BROKER_ERROR,
      err,
    );
  }

  // Redis Errors
  if (
    // eslint-disable-next-line
    (err as any)?.name?.includes("Redis") ||
    // eslint-disable-next-line
    (err as any)?.stack?.includes("redis")
  ) {
    if ((err as any).code === "ECONNREFUSED") {
      return new ApplicationError(
        GenericErrorMessage.SERVICE_UNAVAILABLE,
        HttpStatusCodes.ServiceUnavailable,
        ErrorCode.SYSTEM_UNAVAILABLE,
        ErrorDetails.SYSTEM_UNAVAILABLE,
        err,
      );
    }

    return new ApplicationError(
      "The configuration store is currently unavailable.",
      HttpStatusCodes.InternalServerError,
      ErrorCode.SYSTEM_UNAVAILABLE,
      ErrorDetails.SYSTEM_UNAVAILABLE,
      err,
    );
  }

  // Normal Errors
  if (err instanceof Error) {
    return new ApplicationError(
      err.message,
      HttpStatusCodes.InternalServerError,
      ErrorCode.SYSTEM_INTERNAL_ERROR,
      ErrorDetails.SYSTEM_INTERNAL_ERROR,
      err,
    );
  }

  // Unknown Errors
  return new ApplicationError(
    GenericErrorMessage.INTERNAL_SERVER_ERROR,
    HttpStatusCodes.InternalServerError,
    ErrorCode.SYSTEM_INTERNAL_ERROR,
    ErrorDetails.SYSTEM_INTERNAL_ERROR,
    err,
  );
};

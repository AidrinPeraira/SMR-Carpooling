import { ZodError } from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {
  ApplicationError,
  HttpStatusCodes,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
  UserErrorMessage,
} from "@smr/shared";

export const mapError = (err: unknown): ApplicationError => {
  // If it's already an ApplicationError, return it
  if (err instanceof ApplicationError) {
    return err;
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    return new ApplicationError(
      GenericErrorMessage.VALIDATION_ERROR,
      HttpStatusCodes.UnprocessableEntity,
      ErrorCode.INPUT_VALIDATION_ERROR,
      err.issues,
      err,
    );
  }

  // Mongoose Validation Errors
  if (err instanceof mongoose.Error) {
    if (err instanceof mongoose.Error.ValidationError) {
      return new ApplicationError(
        err.message,
        HttpStatusCodes.UnprocessableEntity,
        ErrorCode.SYSTEM_DB_ERROR,
        err.errors,
        err,
      );
    }

    if (err instanceof mongoose.Error.CastError) {
      return new ApplicationError(
        err.message,
        HttpStatusCodes.BadRequest,
        ErrorCode.SYSTEM_DB_ERROR,
        {
          path: err.path,
          value: err.value,
        },
        err,
      );
    }
  }

  // MongoDB Driver Errors (Duplicate Key 11000)
  if ((err as any)?.code === 11000) {
    return new ApplicationError(
      GenericErrorMessage.CONFLICT,
      HttpStatusCodes.Conflict,
      ErrorCode.DOMAIN_ALREADY_EXISTS,
      (err as any).keyValue, // Pass the actual duplicate data
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
      "The session store is currently unavailable.",
      HttpStatusCodes.InternalServerError,
      ErrorCode.SYSTEM_UNAVAILABLE,
      ErrorDetails.SYSTEM_UNAVAILABLE,
      err,
    );
  }

  // JWT Errors
  if (err instanceof jwt.JsonWebTokenError) {
    if (err instanceof jwt.TokenExpiredError) {
      return new ApplicationError(
        UserErrorMessage.INVALID_TOKEN,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_TOKEN_EXPIRED,
        "The verification token has expired.",
        err,
      );
    }

    return new ApplicationError(
      UserErrorMessage.INVALID_TOKEN,
      HttpStatusCodes.BadRequest,
      ErrorCode.INPUT_VALIDATION_ERROR,
      "The verification token is invalid or malformed.",
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

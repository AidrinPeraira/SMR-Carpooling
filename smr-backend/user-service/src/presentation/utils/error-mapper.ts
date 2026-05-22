import { ZodError } from "zod";
import mongoose from "mongoose";
import {
  ApplicationError,
  HttpStatusCodes,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
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
      ErrorDetails.INPUT_VALIDATION_ERROR,
      err.issues,
    );
  }

  // Mongoose Validation Errors
  if (err instanceof mongoose.Error) {
    if (err instanceof mongoose.Error.ValidationError) {
      return new ApplicationError(
        err.message,
        HttpStatusCodes.UnprocessableEntity,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        err.errors,
      );
    }

    if (err instanceof mongoose.Error.CastError) {
      return new ApplicationError(
        err.message,
        HttpStatusCodes.BadRequest,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.SYSTEM_DB_ERROR,
        {
          path: err.path,
          value: err.value,
        },
      );
    }
  }

  // MongoDB Driver Errors (Duplicate Key 11000)
  // eslint-disabel-next-line
  if ((err as any)?.code === 11000) {
    return new ApplicationError(
      GenericErrorMessage.CONFLICT,
      HttpStatusCodes.Conflict,
      ErrorCode.DOMAIN_ALREADY_EXISTS,
      ErrorDetails.DOMAIN_ALREADY_EXISTS,
      // eslint-disabel-next-line
      (err as any).keyValue, // Pass the actual duplicate data
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

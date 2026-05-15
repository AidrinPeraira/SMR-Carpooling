import { ZodError } from "zod";
import mongoose from "mongoose";
import { ApplicationError, HttpStatusCodes, ErrorCode, ErrorDetails } from "@smr/shared";

export const mapError = (err: unknown, origin: string): ApplicationError => {
  // 1. If it's already an ApplicationError, return it
  if (err instanceof ApplicationError) {
    return err;
  }

  // 2. Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return new ApplicationError(
      origin,
      "Validation failed",
      HttpStatusCodes.UnprocessableEntity,
      ErrorCode.VALIDATION_ERROR,
      ErrorDetails.VALIDATION_ERROR,
      err.errors
    );
  }

  // 3. Handle Mongoose Validation Errors
  if (err instanceof mongoose.Error.ValidationError) {
    return new ApplicationError(
      origin,
      "Database validation failed",
      HttpStatusCodes.BadRequest,
      ErrorCode.DB_ERROR,
      ErrorDetails.DB_ERROR,
      err.errors
    );
  }

  // 4. Handle MongoDB Duplicate Key Error (code 11000)
  if ((err as any)?.code === 11000) {
    return new ApplicationError(
      origin,
      "Conflict: Resource already exists",
      HttpStatusCodes.Conflict,
      ErrorCode.DB_ERROR,
      ErrorDetails.DB_ERROR,
      (err as any).keyValue
    );
  }

  // 5. Handle standard Errors
  if (err instanceof Error) {
    return new ApplicationError(
      origin,
      err.message,
      HttpStatusCodes.InternalServerError,
      ErrorCode.INTERNAL_SERVER_ERROR,
      ErrorDetails.INTERNAL_SERVER_ERROR,
      err
    );
  }

  // 6. Final fallback for unknown types
  return new ApplicationError(
    origin,
    "An unexpected error occurred",
    HttpStatusCodes.InternalServerError,
    ErrorCode.INTERNAL_SERVER_ERROR,
    ErrorDetails.INTERNAL_SERVER_ERROR,
    err
  );
};

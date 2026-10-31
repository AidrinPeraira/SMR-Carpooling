import axios from "axios";
import {
  ApplicationError,
  HttpStatusCodes,
  ErrorCode,
  GenericErrorMessage,
  ErrorDetails,
} from "@sharemyride/shared";

export const mapError = (err: unknown): ApplicationError => {
  if (err instanceof ApplicationError) {
    return err;
  }

  if (axios.isAxiosError(err)) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return new ApplicationError(
        GenericErrorMessage.SERVICE_UNAVAILABLE,
        HttpStatusCodes.ServiceUnavailable,
        ErrorCode.SYSTEM_UNAVAILABLE,
        ErrorDetails.SYSTEM_UNAVAILABLE,
        err,
      );
    }

    return new ApplicationError(
      (err.response?.data as { message?: string })?.message ?? GenericErrorMessage.INTERNAL_SERVER_ERROR,
      err.response?.status ?? HttpStatusCodes.InternalServerError,
      ErrorCode.SYSTEM_INTERNAL_ERROR,
      {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        responseBody: err.response?.data,
      },
      err,
    );
  }

  if (err instanceof Error) {
    return new ApplicationError(
      GenericErrorMessage.INTERNAL_SERVER_ERROR,
      HttpStatusCodes.InternalServerError,
      ErrorCode.SYSTEM_INTERNAL_ERROR,
      ErrorDetails.SYSTEM_INTERNAL_ERROR,
      err,
    );
  }

  return new ApplicationError(
    GenericErrorMessage.INTERNAL_SERVER_ERROR,
    HttpStatusCodes.InternalServerError,
    ErrorCode.SYSTEM_INTERNAL_ERROR,
    ErrorDetails.SYSTEM_INTERNAL_ERROR,
    err,
  );
};

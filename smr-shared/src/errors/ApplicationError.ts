import { HttpStatusCodes } from "../enums/HttpStatusEnums";
import { ErrorCode, ErrorDetails } from "./ErrorEnums";

export class ApplicationError extends Error {
  constructor(
    public readonly origin: string,
    message: string,
    public readonly statusCode: HttpStatusCodes,
    public readonly errorCode: ErrorCode,
    public readonly details: ErrorDetails,
    public readonly err?: any,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

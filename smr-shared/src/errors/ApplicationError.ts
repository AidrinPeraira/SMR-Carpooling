import { HttpStatusCodes } from "../enums/HttpStatusEnums";
import { ErrorCode, ErrorDetails } from "./ErrorEnums";

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: HttpStatusCodes,
    public readonly errorCode: ErrorCode,
    public readonly details: ErrorDetails,
    public readonly cause?: any,
  ) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

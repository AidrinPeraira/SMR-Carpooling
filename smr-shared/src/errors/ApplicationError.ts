import { HttpStatusCodes } from "../enums/HttpStatusEnums";
import { ErrorCode } from "./ErrorEnums";

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: HttpStatusCodes,
    public readonly errorCode: ErrorCode,
    public readonly details: any,
    public readonly cause?: any,
  ) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

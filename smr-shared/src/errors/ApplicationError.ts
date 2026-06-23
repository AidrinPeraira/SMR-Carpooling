import { HttpStatusCodes } from "../enums/HttpStatusEnums";
import { ErrorCode } from "./ErrorEnums";

export class ApplicationError<T = any> extends Error {
  public readonly timestamp!: Date;

  constructor(
    message: string,
    public readonly statusCode: HttpStatusCodes,
    public readonly errorCode: ErrorCode,
    public readonly details: T,
    public readonly cause?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.defineProperty(this, "timestamp", {
      value: new Date(),
      enumerable: false,
      configurable: true,
      writable: true,
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

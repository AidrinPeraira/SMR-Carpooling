import { ILogger } from "@sharemyride/shared";
import winston from "winston";

export class WinstonLoggerService implements ILogger {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), // structured JSON — plays
      ),
      transports: [new winston.transports.Console()],
    });
  }

  info(message: string, data?: unknown): void {
    this.logger.info(message, { data });
  }

  warn(message: string, data?: unknown): void {
    this.logger.warn(message, { data });
  }

  error(message: string, data?: unknown): void {
    this.logger.error(message, { data });
  }

  debug(message: string, data?: unknown): void {
    this.logger.debug(message, { data });
  }

  http(message: string, data?: unknown): void {
    this.logger.http(message, { data });
  }
}

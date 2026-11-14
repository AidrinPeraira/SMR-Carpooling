import { ILogger } from "@sharemyride/shared";
import winston from "winston";
import { AppConfig } from "#/application.config";

export class WinstonLoggerService implements ILogger {
  private readonly logger: winston.Logger;

  constructor() {
    const level = AppConfig.NODE_ENV === "production" ? "info" : "debug";
    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
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

export const logger = new WinstonLoggerService();

import { ILogger } from "./logger-interface";
import { createConsola } from "consola";

export class ConsolaLogger implements ILogger {
  private readonly logger;

  constructor() {
    this.logger = createConsola();
  }

  warn(message: string, data?: unknown): void {
    if (data !== undefined) {
      this.logger.warn(message, data);
    } else {
      this.logger.warn(message);
    }
  }

  info(message: string, data?: unknown): void {
    if (data !== undefined) {
      this.logger.info(message, data);
    } else {
      this.logger.info(message);
    }
  }

  error(message: string, data?: unknown): void {
    if (data !== undefined) {
      this.logger.error(message, data);
    } else {
      this.logger.error(message);
    }
  }

  debug(message: string, data?: unknown): void {
    if (data !== undefined) {
      this.logger.debug(message, data);
    } else {
      this.logger.debug(message);
    }
  }

  http(message: string, data?: unknown): void {
    const logger = this.logger.withTag("http");
    if (data !== undefined) {
      logger.log(message, data);
    } else {
      logger.log(message);
    }
  }
}

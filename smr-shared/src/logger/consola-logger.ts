import { ILogger } from "./logger-interface";
import { createConsola } from "consola";

export class ConsolaLogger implements ILogger {
  private readonly logger;

  constructor() {
    this.logger = createConsola();
  }

  warn(message: string, data: unknown): void {
    this.logger.warn(message, data);
  }

  info(message: string, data: unknown): void {
    this.logger.info(message, data);
  }

  error(message: string, data: unknown): void {
    this.logger.error(message, data);
  }

  debug(message: string, data: unknown): void {
    this.logger.debug(message, data);
  }

  http(message: string, data: unknown): void {
    this.logger.withTag("http").log(message, data);
  }
}

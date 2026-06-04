export interface ILogger {
  error(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  http(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
}

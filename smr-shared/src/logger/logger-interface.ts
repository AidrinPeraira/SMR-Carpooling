export interface ILogger {
  error(message: string, data: Record<string, unknown>): void;
  warn(message: string, data: Record<string, unknown>): void;
  info(message: string, data: Record<string, unknown>): void;
  http(message: string, data: Record<string, unknown>): void;
  debug(message: string, data: Record<string, unknown>): void;
}

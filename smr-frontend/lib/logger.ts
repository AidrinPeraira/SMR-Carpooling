import { ConsolaLogger, ILogger } from "@smr/shared";

let logger: ILogger;

if (typeof window !== "undefined") {
  logger = {
    error: (...data) => console.error(...data),
    info: (...data) => console.log(...data),
    warn: (...data) => console.warn(...data),
    http: (...data) => console.log(...data),
    debug: (...data) => console.debug(...data),
  };
} else {
  logger = new ConsolaLogger();
}

export { logger };

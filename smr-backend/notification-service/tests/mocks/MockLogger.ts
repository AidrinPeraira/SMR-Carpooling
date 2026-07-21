import { ILogger } from "@sharemyride/shared";
import { vi } from "vitest";

export const MockLogger = vi.fn(
  class implements ILogger {
    info = vi.fn();
    warn = vi.fn();
    error = vi.fn();
    http = vi.fn();
    debug = vi.fn();
  },
);

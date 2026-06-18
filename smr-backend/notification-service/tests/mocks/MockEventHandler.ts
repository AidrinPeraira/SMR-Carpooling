import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { vi } from "vitest";

export const MockEventHandler = vi.fn(
  class implements IEventHandler {
    handle = vi.fn();
  },
);

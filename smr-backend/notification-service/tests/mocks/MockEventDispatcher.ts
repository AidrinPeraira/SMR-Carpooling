import { IEventDispatcher } from "#/application/interfaces/messaging/IEventDispatcher";
import { vi } from "vitest";

export const MockEventDispatcher = vi.fn(
  class implements IEventDispatcher {
    register = vi.fn();
    dispatch = vi.fn();
  },
);

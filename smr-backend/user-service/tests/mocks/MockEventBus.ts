import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { vi } from "vitest";

const EventBus = vi.fn(
  class implements IEventBus {
    publish = vi.fn();
  },
);
export const mockEventBus = new EventBus();

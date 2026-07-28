import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { vi } from "vitest";

const EventBus = vi.fn(
  class implements IEventBus {
    connect = vi.fn();
    publish = vi.fn();
    consume = vi.fn();
  },
);

export const mockEventBus = new EventBus();

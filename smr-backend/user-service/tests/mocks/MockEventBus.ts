import { IEventBus } from "#/application/interfaces/services/IEventBus";
import { vi } from "vitest";

const EventBus = vi.fn(
  class implements IEventBus {
    publish = vi.fn();
  },
);
export const mockEventBus = new EventBus();

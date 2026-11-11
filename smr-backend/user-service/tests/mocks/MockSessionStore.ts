import { ISessionStore } from "#/application/interfaces/store/ISessionStore";
import { vi } from "vitest";

const SessionStore = vi.fn(
  class implements ISessionStore {
    addToSessionBlacklist = vi.fn();
    removeFromSessionBlacklist = vi.fn();
  },
);
export const mockSessionStore = new SessionStore();


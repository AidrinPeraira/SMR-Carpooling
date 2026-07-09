import { ISessionStore } from "#/application/interfaces/store/ISessionStore";
import { vi } from "vitest";

const SessionStore = vi.fn(
  class implements ISessionStore {
    setSession = vi.fn();
    getSession = vi.fn();
    removeSession = vi.fn();
    updateSession = vi.fn();
  },
);
export const mockSessionStore = new SessionStore();

import { ISessionRepository } from "#/application/interfaces/repository/ISessionRepository";
import { vi } from "vitest";

const SessionRepository = vi.fn(
  class implements ISessionRepository {
    setSession = vi.fn();
    getSession = vi.fn();
    updateSession = vi.fn();
  },
);
export const mockSessionRepository = new SessionRepository();

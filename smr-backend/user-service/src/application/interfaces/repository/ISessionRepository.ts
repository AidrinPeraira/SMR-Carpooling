import { AuthSession } from "@smr/shared";

/**
 * This is the interface for the session  repositpry.
 * this is to handle user's auth sessions.
 */
export interface ISessionRepository {
  setSession(
    key: string,
    value: AuthSession,
    ttlSeconds?: number,
  ): Promise<void>;
  getSession(key: string): Promise<AuthSession | null>;
  updateSession(
    key: string,
    value: AuthSession,
    ttlSeconds?: number,
  ): Promise<void>;
}

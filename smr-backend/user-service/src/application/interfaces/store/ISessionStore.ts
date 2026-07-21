import { AuthSession } from "@sharemyride/shared";

/**
 * This is the interface for the session  repositpry.
 * this is to handle user's auth sessions.
 */
export interface ISessionStore {
  setSession(
    key: string,
    value: AuthSession,
    ttlSeconds?: number,
  ): Promise<void>;

  getSession(key: string): Promise<AuthSession | null>;

  removeSession(key: string): Promise<void>;

  updateSession(
    key: string,
    value: AuthSession,
    ttlSeconds?: number,
  ): Promise<void>;
}

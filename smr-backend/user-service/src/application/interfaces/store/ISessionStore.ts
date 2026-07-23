/**
 * Interface for session store operations.
 */
export interface ISessionStore {
  addToSessionBlacklist(userId: string): Promise<void>;
  removeFromSessionBlacklist(userId: string): Promise<void>;
}


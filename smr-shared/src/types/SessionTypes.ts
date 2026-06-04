export interface AuthSession {
  userId: string;
  activeRefreshTokens: string[];
}

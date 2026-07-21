import { ISessionStore } from "#/application/interfaces/store/ISessionStore";
import { AuthSession } from "@sharemyride/shared";
import { RedisClientType } from "redis";

export class RedisSessionStore implements ISessionStore {
  constructor(private readonly _redisClient: RedisClientType) {}

  async setSession(
    key: string,
    value: AuthSession,
    ttlSeconds?: number,
  ): Promise<void> {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await this._redisClient.set(key, data, { EX: ttlSeconds });
    } else {
      await this._redisClient.set(key, data);
    }
  }

  async getSession(key: string): Promise<AuthSession | null> {
    const data = await this._redisClient.get(key);
    return data ? (JSON.parse(data) as AuthSession) : null;
  }

  async removeSession(key: string): Promise<void> {
    await this._redisClient.unlink(key);
  }

  async updateSession(
    key: string,
    value: AuthSession,
    ttlSeconds?: number,
  ): Promise<void> {
    await this.setSession(key, value, ttlSeconds);
  }
}

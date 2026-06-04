import { ISessionRepository } from "#/application/interfaces/repository/ISessionRepository";
import { AuthSession } from "@smr/shared";
import { RedisClientType } from "redis";

export class RedisSessionRepository implements ISessionRepository {
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

  async updateSession(
    key: string,
    value: AuthSession,
    ttlSeconds?: number,
  ): Promise<void> {
    await this.setSession(key, value, ttlSeconds);
  }
}

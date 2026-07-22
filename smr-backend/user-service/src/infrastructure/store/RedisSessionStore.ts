import { ISessionStore } from "#/application/interfaces/store/ISessionStore";
import { AuthSessionNames } from "@sharemyride/shared";
import { RedisClientType } from "redis";

export class RedisSessionStore implements ISessionStore {
  constructor(private readonly _redisClient: RedisClientType) {}

  async addToSessionBlacklist(userId: string): Promise<void> {
    await this._redisClient.sAdd(AuthSessionNames.AUTH_BLACKLIST, userId);
  }

  async removeFromSessionBlacklist(userId: string): Promise<void> {
    await this._redisClient.sRem(AuthSessionNames.AUTH_BLACKLIST, userId);
  }
}


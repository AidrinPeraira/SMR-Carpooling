import { IPlacesCacheStore } from "#/application/interfaces/store/IPlacesCacheStore";
import { ILogger } from "@sharemyride/shared";
import { RedisClientType } from "redis";

/**
 * Implementation for places cache store operations using Redis.
 * Caches valid place spatial indices in a Redis Set.
 */
export class PlacesCacheStore implements IPlacesCacheStore {
  private readonly _cacheKey = "places:indices";

  constructor(
    private readonly _redisClient: RedisClientType,
    private readonly _logger: ILogger,
  ) {}

  async addPlaceIndices(indices: string[]): Promise<void> {
    if (indices.length === 0) return;
    try {
      await this._redisClient.sAdd(this._cacheKey, indices);
    } catch {
      // Ignore Redis write errors gracefully
    }
  }

  async checkPlaceIndices(indices: string[]): Promise<number[]> {
    if (indices.length === 0) return [];
    try {
      return await this._redisClient.smIsMember(this._cacheKey, indices);
    } catch (error: unknown) {
      this._logger.error("Redis place cache matching error: ", error);
      return indices.map(() => 0);
    }
  }

  async hasCache(): Promise<boolean> {
    try {
      const exists = await this._redisClient.exists(this._cacheKey);
      return exists > 0;
    } catch {
      return false;
    }
  }
}


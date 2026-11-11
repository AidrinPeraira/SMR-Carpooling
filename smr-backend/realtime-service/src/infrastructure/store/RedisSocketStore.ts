import { ISocketStore } from "#/application/interfaces/services/ISocketStore";
import { RedisClientType } from "redis";

export class RedisSocketStore implements ISocketStore {
  constructor(private readonly _redisClient: RedisClientType) {}

  private getKey(journeyId: string): string {
    return `share:${journeyId}`;
  }

  async addSocket(
    journeyId: string,
    token: string,
    socketId: string,
  ): Promise<void> {
    await this._redisClient.hSet(this.getKey(journeyId), token, socketId);
  }

  async removeSocket(journeyId: string, token: string): Promise<void> {
    await this._redisClient.hDel(this.getKey(journeyId), token);
  }

  async getSocketsByJourney(journeyId: string): Promise<Map<string, string>> {
    const entries = await this._redisClient.hGetAll(this.getKey(journeyId));
    return new Map(Object.entries(entries));
  }

  async getSocketByToken(
    journeyId: string,
    token: string,
  ): Promise<string | null> {
    return this._redisClient.hGet(this.getKey(journeyId), token) ?? null;
  }

  async clearJourney(journeyId: string): Promise<void> {
    await this._redisClient.del(this.getKey(journeyId));
  }
}

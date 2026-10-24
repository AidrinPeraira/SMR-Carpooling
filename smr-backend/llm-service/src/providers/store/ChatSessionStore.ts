import { IChatSessionStore } from "#/contracts/interfaces/store/IChatSessionStore";
import { ChatSession } from "#/contracts/entity/ChatSessionEntity";
import { RedisClientType } from "redis";

export class ChatSessionStore implements IChatSessionStore {
  constructor(private readonly _redisClient: RedisClientType) {}

  async createSession(
    userId: string,
    newSession: ChatSession,
  ): Promise<ChatSession> {}
}

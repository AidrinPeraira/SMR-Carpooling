import { ChatSession } from "#/contracts/entity/ChatSessionEntity";

/**
 * This stores chat session date during the chat lifecycle
 * and handles ttl lifespan of sessions internaly
 */
export interface IChatSessionStore {
  createSession(userId: string, newSession: ChatSession): Promise<ChatSession>;

  updateChatSession(
    userId: string,
    updatedChatSession: Partial<ChatSession>,
  ): Promise<ChatSession>;

  clearChatSession(userId: string): Promise<void>;

  findChatSession(userId: string): Promise<ChatSession | null>;
}

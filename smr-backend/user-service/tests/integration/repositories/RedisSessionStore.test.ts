import { RedisSessionStore } from "#/infrastructure/store/RedisSessionStore";
import { AuthSession, AccountStatus } from "@smr/shared";
import { createClient } from "redis";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";

describe("RedisSessionStore Integration", () => {
  let redisClient: any;
  let sessionStore: RedisSessionStore;

  beforeAll(async () => {
    const url = process.env.REDIS_TEST_URL;
    if (!url) {
      throw new Error("Redis test url not found in environment");
    }

    redisClient = createClient({ url });
    await redisClient.connect();
    sessionStore = new RedisSessionStore(redisClient);
  });

  afterAll(async () => {
    await redisClient.disconnect();
  });

  beforeEach(async () => {
    await redisClient.flushAll();
  });

  const mockSession: AuthSession = {
    userId: "user-123",
    status: AccountStatus.BLOCKED,
  };

  it("should successfully save and retrieve a session", async () => {
    const key = "auth:session:user-123";

    await sessionStore.setSession(key, mockSession);
    const result = await sessionStore.getSession(key);

    expect(result).toEqual(mockSession);
  });

  it("should return null if session does not exist", async () => {
    const result = await sessionStore.getSession("non-existent");
    expect(result).toBeNull();
  });

  it("should successfully update a session", async () => {
    const key = "auth:session:user-123";
    await sessionStore.setSession(key, mockSession);

    const updatedSession: AuthSession = {
      ...mockSession,
      status: AccountStatus.ACTIVE,
    };

    await sessionStore.updateSession(key, updatedSession);
    const result = await sessionStore.getSession(key);

    expect(result?.status).toBe(AccountStatus.ACTIVE);
  });
});

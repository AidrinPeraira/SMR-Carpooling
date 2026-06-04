import { RedisSessionRepository } from "#/infrastructure/repository/RedisSessionRepository";
import { AuthSession } from "@smr/shared";
import { createClient } from "redis";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";

describe("RedisSessionRepository Integration", () => {
  let redisClient: any;
  let sessionRepository: RedisSessionRepository;

  beforeAll(async () => {
    const url = process.env.REDIS_TEST_URL;
    if (!url) {
      throw new Error("Redis test url not found in environment");
    }

    redisClient = createClient({ url });
    await redisClient.connect();
    sessionRepository = new RedisSessionRepository(redisClient);
  });

  afterAll(async () => {
    await redisClient.disconnect();
  });

  beforeEach(async () => {
    await redisClient.flushAll();
  });

  const mockSession: AuthSession = {
    userId: "user-123",
    activeRefreshTokens: ["token-1", "token-2"],
  };

  it("should successfully save and retrieve a session", async () => {
    const key = "auth:session:user-123";

    await sessionRepository.setSession(key, mockSession);
    const result = await sessionRepository.getSession(key);

    expect(result).toEqual(mockSession);
  });

  it("should return null if session does not exist", async () => {
    const result = await sessionRepository.getSession("non-existent");
    expect(result).toBeNull();
  });

  it("should successfully update a session", async () => {
    const key = "auth:session:user-123";
    await sessionRepository.setSession(key, mockSession);

    const updatedSession: AuthSession = {
      ...mockSession,
      activeRefreshTokens: [...mockSession.activeRefreshTokens, "token-3"],
    };

    await sessionRepository.updateSession(key, updatedSession);
    const result = await sessionRepository.getSession(key);

    expect(result?.activeRefreshTokens).toHaveLength(3);
    expect(result?.activeRefreshTokens).toContain("token-3");
  });
});

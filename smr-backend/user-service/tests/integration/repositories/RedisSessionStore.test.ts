import { RedisSessionStore } from "#/infrastructure/store/RedisSessionStore";
import { AuthSessionNames } from "@sharemyride/shared";
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

  it("should successfully add a user to the blacklist set and remove them", async () => {
    const userId = "user-123";

    await sessionStore.addToSessionBlacklist(userId);
    let isMember = await redisClient.sIsMember(AuthSessionNames.AUTH_BLACKLIST, userId);
    expect(Boolean(isMember)).toBe(true);

    await sessionStore.removeFromSessionBlacklist(userId);
    isMember = await redisClient.sIsMember(AuthSessionNames.AUTH_BLACKLIST, userId);
    expect(Boolean(isMember)).toBe(false);
  });
});


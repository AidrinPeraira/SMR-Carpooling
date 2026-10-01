import { AppConfig } from "#/application.config";
import { ILogger } from "@sharemyride/shared";
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

export function getRedisClient(): RedisClientType {
  return redisClient;
}

export async function connectRedis(logger: ILogger): Promise<void> {
  redisClient = createClient({
    url: AppConfig.REDIS_URL,
  });

  redisClient.on("error", (err: unknown) => {
    logger.info("Redis client error: ", err);
  });

  try {
    logger.info("Connecting to redis client.");
    await redisClient.connect();
    logger.info("Connected to redis client.");
  } catch (error: unknown) {
    logger.error("Error connecting to redis: ", error);
    process.exit(1);
  }
}

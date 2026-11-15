import { createClient, type RedisClientType } from "redis";
import { AppConfig } from "#/application.config";
import { logger } from "#/services/LoggerService";

let redisClient: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    redisClient = createClient({ url: AppConfig.REDIS_URL });
    redisClient.on("error", (err) => {
      logger.error("Redis client error:", err.message);
    });
  }
  return redisClient;
}

export async function connectRedis(): Promise<RedisClientType> {
  const client = getRedisClient();
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

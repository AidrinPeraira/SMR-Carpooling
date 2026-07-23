import { createClient, type RedisClientType } from "redis";
import { AppConfig } from "#/application.config";

let redisClient: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    redisClient = createClient({ url: AppConfig.REDIS_URL });
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

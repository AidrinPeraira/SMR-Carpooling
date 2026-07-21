import { AppConfig } from "#/application.config";
import { ILogger } from "@sharemyride/shared";
import { createClient } from "redis";

export const redisClient = createClient({
  url: AppConfig.REDIS_URL,
});

export async function connectRedis(logger: ILogger): Promise<void> {
  redisClient.on("error", (err) => {
    logger.info("Redis client error: ", err);
  });

  try {
    logger.info("Connecting to redis client. ");
    await redisClient.connect();
    logger.info("Connected to redis client.");
  } catch (error: unknown) {
    logger.error("Error connecting to redis: ", error);
    process.exit(1);
  }
}

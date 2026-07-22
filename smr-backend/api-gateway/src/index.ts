import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { connectRedis } from "#/config/redis.config";
import { ConsolaLogger } from "@sharemyride/shared";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();

  try {
    await connectRedis();
    logger.info("Connected to Redis in api-gateway");
  } catch (error) {
    logger.error("Failed to connect to Redis in api-gateway", { error });
  }

  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The api-gateway is running at port: ${PORT}.`, { port: PORT });
  });
}

startServer().catch((error: unknown) => {
  const logger = new ConsolaLogger();
  logger.error("Failed to start the api-gateway server", { error });
});

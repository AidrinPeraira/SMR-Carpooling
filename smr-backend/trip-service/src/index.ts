import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { ConsolaLogger } from "@sharemyride/shared";
import { eventBus } from "#/presentation/trip-service.module";
import { connectRedis } from "#/infrastructure/store/connect-redis";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();

  // Connect Redis
  await connectRedis(logger);

  // Connect RabbitMQ
  await eventBus.connect();

  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The trip-service is running at port: ${PORT}.`, {
      port: PORT,
    });
  });
}

startServer().catch((error: unknown) => {
  const logger = new ConsolaLogger();
  logger.error("Failed to start the trip-service server", {
    error: error instanceof Error ? error.message : String(error),
  });
});

import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { ConsolaLogger, EventName } from "@sharemyride/shared";
import { eventBus } from "#/presentation/user-service.module";
import { connectMongoDB } from "#/infrastructure/database/connect-mongodb";
import { connectRedis } from "#/infrastructure/database/connect-redis";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();

  //Connect MongoDB
  await connectMongoDB(logger);

  //Connect RabbitMQ & start consuming
  await eventBus.connect();
  await eventBus.subscribe([
    EventName.ADMIN_ADD_NEW_VEHICLE,
    EventName.ADMIN_UPDATE_NEW_VEHICLE,
  ]);
  await eventBus.consume();

  //Connect Redis
  await connectRedis(logger);

  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The user-service is running at port: ${PORT}.`);
  });
}

startServer().catch((error: unknown) => {
  const logger = new ConsolaLogger();
  logger.error("Failed to start the user-service server", {
    error: error instanceof Error ? error.message : String(error),
  });
});

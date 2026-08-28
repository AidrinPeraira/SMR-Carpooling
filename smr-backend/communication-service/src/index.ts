import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { ConsolaLogger } from "@sharemyride/shared";
import { connectMongoDB } from "#/infrastructure/database/connect-mongodb";
import { eventBus } from "#/presentation/communication-service.module";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();

  await connectMongoDB(logger);
  await eventBus.connect();

  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The communication-service is running at port: ${PORT}.`);
  });
}

startServer().catch((error: unknown) => {
  const logger = new ConsolaLogger();
  logger.error("Failed to start the communication-service server", {
    error: error instanceof Error ? error.message : String(error),
  });
});

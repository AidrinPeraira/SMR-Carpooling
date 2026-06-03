import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { ConsolaLogger } from "@smr/shared";
import { eventBus } from "#/presentation/user-service.module";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();

  //Connect MongoDB
  await mongoose.connect(AppConfig.MONGO_DB_URL);
  logger.info("Connected to MongoDB Atlas.");

  //Connect RabbitMQ
  await eventBus.connect();

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

import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { ConsolaLogger } from "@sharemyride/shared";
import { messageConsumer } from "#/presentation/notification-service.module";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();
  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  //connet and consume messages
  await messageConsumer.connect();

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The notification-service is running at port: ${PORT}.`, {
      port: PORT,
    });
  });
}

startServer().catch((error: unknown) => {
  const logger = new ConsolaLogger();
  logger.error("Failed to start the notification-service server", { error });
});

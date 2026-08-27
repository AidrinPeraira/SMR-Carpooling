import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { connectMongoDB } from "#/infrastructure/database/connect-mongodb";
import { eventBus } from "#/presentation/payment-service.module";
import { ConsolaLogger } from "@sharemyride/shared";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();
  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  await connectMongoDB(logger);

  eventBus.connect().catch((err: unknown) => {
    logger.error("Failed to connect EventBus in payment-service", {
      error: err,
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The payment-service is running at port: ${PORT}.`, {
      port: PORT,
    });
  });
}

startServer().catch((error: unknown) => {
  const logger = new ConsolaLogger();
  logger.error("Failed to start the payment-service server", { error });
});

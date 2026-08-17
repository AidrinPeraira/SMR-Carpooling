import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { ConsolaLogger } from "@sharemyride/shared";
import { connectMongoDB } from "#/infrastructure/database/connect-mongodb";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();
  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  await connectMongoDB(logger);

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

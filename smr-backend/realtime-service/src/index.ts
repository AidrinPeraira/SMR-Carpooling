import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { connectMongoDB } from "#/infrastructure/database/connect-mongodb";
import { WinstonLoggerService } from "#/infrastructure/services/LoggerService";
import { setUpRealtimeModule } from "#/presentation/realtime-service.module";
import { createServer } from "node:http";

async function startServer(): Promise<void> {
  const logger = new WinstonLoggerService();

  await connectMongoDB(logger);

  const app = createApp();
  const PORT = Number(AppConfig.PORT);

  const httpServer = createServer(app);

  const { eventBus } = await setUpRealtimeModule(httpServer, logger);

  await eventBus.connect();

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`The realtime-service is running at port: ${PORT}.`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start the realtime-service server", error);
});

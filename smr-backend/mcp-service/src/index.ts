import "dotenv/config";
import { AppConfig } from "#/application.config";
import { createApp } from "#/app";
import { logger } from "#/services/LoggerService";

async function startServer(): Promise<void> {
  const app = await createApp();

  const PORT = Number(AppConfig.PORT);

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The MCP Server is running at port: ${PORT}.`, {
      port: PORT,
    });
  });
}

startServer().catch((error: unknown) => {
  logger.error("Failed to start the MCP Server: ", { error });
});

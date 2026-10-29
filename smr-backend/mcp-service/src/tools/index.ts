import { AppConfig } from "#/application.config";
import { registerPassengerTools } from "#/tools/passenger/passenger.tools";
import { registerDriverTools } from "#/tools/driver/driver.tools";
import { McpServer } from "@modelcontextprotocol/server";

export function createPassengerMcpServer(): McpServer {
  const server = new McpServer({
    name: `${AppConfig.SERVICE_NAME}-passenger`,
    version: AppConfig.SERVICE_VERSION,
  });

  registerPassengerTools(server);

  return server;
}

export function createDriverMcpServer(): McpServer {
  const server = new McpServer({
    name: `${AppConfig.SERVICE_NAME}-driver`,
    version: AppConfig.SERVICE_VERSION,
  });

  registerDriverTools(server);

  return server;
}

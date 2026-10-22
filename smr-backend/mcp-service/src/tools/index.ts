import { AppConfig } from "#/application.config";
import { registerPassengerTools } from "#/tools/passenger/passenger.tools";
import { McpServer } from "@modelcontextprotocol/server";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: AppConfig.SERVICE_NAME,
    version: AppConfig.SERVICE_VERSION,
  });

  registerPassengerTools(server);

  return server;
}

import { SearchTripToolDefinition } from "#/tools/passenger/definitions/SearchTripToolDefinition";
import { handleSearchTripToolCall } from "#/tools/passenger/handlers/SearchTripToolHandler";
import { McpServer } from "@modelcontextprotocol/server";

export function registerPassengerTools(server: McpServer): void {
  server.registerTool(
    "search-trips",
    SearchTripToolDefinition,
    handleSearchTripToolCall,
  );
}

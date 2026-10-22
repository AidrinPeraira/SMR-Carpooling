import dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  NODE_ENV: String(process.env.NODE_ENV) || "development",

  MCP_SERVICE_PORT: Number(process.env.MCP_SERVICE_PORT) || 4007,
  MCP_SERVICE_NAME: String(process.env.MCP_SERVICE_NAME) || "mcp-service",
  MCP_SERVICE_VERSION: String(process.env.MCP_SERVICE_VERSION) || "0.0.1",

  API_GATEWAY_KEY: String(process.env.API_GATEWAY_KEY) || "secret-key",

  MAPBOX_TOKEN: String(process.env.MAPBOX_TOKEN) || "secret-token",
};

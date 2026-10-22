import dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  NODE_ENV: String(process.env.NODE_ENV) || "development",

  PORT: Number(process.env.MCP_SERVICE_PORT) || 4007,
  SERVICE_NAME: String(process.env.MCP_SERVICE_NAME) || "mcp-service",
  SERVICE_VERSION: String(process.env.MCP_SERVICE_VERSION) || "0.0.1",

  API_GATEWAY_KEY: String(process.env.API_GATEWAY_KEY) || "secret-key",
  API_GATEWAY_URL:
    String(process.env.API_GATEWAY_URL) || "http://localhost:4000",

  MAPBOX_TOKEN: String(process.env.MAPBOX_TOKEN) || "secret-token",
};

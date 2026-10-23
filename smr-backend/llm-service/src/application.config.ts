import dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  NODE_ENV: String(process.env.NODE_ENV) || "development",

  LLM_SERVICE_PORT: Number(process.env.LLM_SERVICE_PORT) || 4006,
  LLM_SERVICE_NAME: String(process.env.LLM_SERVICE_NAME) || "llm-service",
  LLM_SERVICE_VERSION: String(process.env.LLM_SERVICE_VERSION) || "0.0.1",

  API_GATEWAY_KEY: String(process.env.API_GATEWAY_KEY) || "secret-key",

  MCP_SERVICE_URL:
    String(process.env.MCP_SERVICE_URL) || "http://localhost:4007",

  MAPBOX_TOKEN: String(process.env.MAPBOX_TOKEN) || "secret-token",

  MAPBOX_MCP_URL:
    String(process.env.MAPBOX_MCP_URL) || "ttps://mcp.mapbox.com/mcp",

  GEMINI_API_KEY: String(process.env.GEMINI_API_KEY) || "secret-key",
};

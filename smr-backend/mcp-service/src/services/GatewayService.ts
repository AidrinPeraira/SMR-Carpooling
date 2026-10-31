import { AppConfig } from "#/application.config";
import { logger } from "#/services/LoggerService";
import axios from "axios";

export const GatewayClient = axios.create({
  baseURL: AppConfig.API_GATEWAY_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-mcp-key": AppConfig.MCP_SERVICE_KEY,
  },
});

GatewayClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      logger.error(
        `Gateway request failed: ${error.config?.method?.toUpperCase()} ${error.config?.url} → ${error.response?.status ?? "NO_RESPONSE"}`,
        {
          status: error.response?.status,
          responseBody: error.response?.data,
          message: error.message,
        },
      );
    }
    return Promise.reject(error as Error);
  },
);

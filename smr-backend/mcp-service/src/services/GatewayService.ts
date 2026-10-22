import { AppConfig } from "#/application.config";
import axios from "axios";

export const GatewayClient = axios.create({
  baseURL: AppConfig.API_GATEWAY_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

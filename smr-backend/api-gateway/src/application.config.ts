import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: String(process.env.NODE_ENV) || "development",
  USER_SERVICE_URL:
    String(process.env.USER_SERVICE_URL) || "https://localhost:4001",
};

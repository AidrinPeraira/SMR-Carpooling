import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: String(process.env.NODE_ENV) || "development",
  CUSTOM_ID_LENGTH: Number(process.env.CUSTOM_ID_LENGTH) || 6,
  TOKEN_LIFE_MINUTES: Number(process.env.TOKEN_LIFE_MINUTES) || 10,
  MONGO_DB_URL: String(process.env.MONGO_DB_URL),
  GENERIC_SECRET: String(process.env.GENERIC_SECRET) || "random-secret-key",
  RABBITMQ_URL: String(process.env.RABBITMQ_URL) || "http://localhost:5672",
  RABBITMQ_EXCHANGE_NAME:
    String(process.env.RABBITMQ_EXCHANGE_NAME) || "sharemyride.events",
};

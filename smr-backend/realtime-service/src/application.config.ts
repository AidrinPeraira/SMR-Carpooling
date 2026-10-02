import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4005,
  NODE_ENV: String(process.env.NODE_ENV || "development"),

  MONGO_DB_URL: String(process.env.MONGO_DB_URL),
  REDIS_URL: String(process.env.REDIS_URL) || "redis://localhost:6379",

  API_GATEWAY_KEY: String(
    process.env.API_GATEWAY_KEY ||
      "smr_gateway_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe",
  ),

  FRONTEND_KEY: String(
    process.env.FRONTEND_KEY || "smr_frontend_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe",
  ),

  ACCESS_TOKEN_SECRET: String(process.env.ACCESS_TOKEN_SECRET),

  RABBITMQ_URL: String(process.env.RABBITMQ_URL || "amqp://localhost:5672"),
  RABBITMQ_EXCHANGE_NAME: String(
    process.env.RABBITMQ_EXCHANGE_NAME || "sharemyride.events",
  ),

  SERVICE_NAME: String(process.env.SERVICE_NAME) || "realtime-service",
  SERVICE_VERSION: String(process.env.SERVICE_VERSION) || "0.0.1",

  OTEL_EXPORTER_OTLP_ENDPOINT: String(
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "",
  ),
  OTEL_EXPORTER_OTLP_HEADERS: String(
    process.env.OTEL_EXPORTER_OTLP_HEADERS || "",
  ),
};

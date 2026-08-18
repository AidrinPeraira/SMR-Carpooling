import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4003,
  NODE_ENV: String(process.env.NODE_ENV) || "development",

  API_GATEWAY_KEY: String(
    process.env.API_GATEWAY_KEY ||
      "smr_gateway_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe",
  ),
  API_GATEWAY_URL: String(
    process.env.API_GATEWAY_URL || "http://localhost:4000",
  ),

  DATABASE_URL: String(process.env.DATABASE_URL) || "",
  REDIS_URL: String(process.env.REDIS_URL) || "redis://localhost:6379",
  RABBITMQ_URL: String(process.env.RABBITMQ_URL || "amqp://localhost:5672"),
  RABBITMQ_EXCHANGE_NAME: String(
    process.env.RABBITMQ_EXCHANGE_NAME || "sharemyride.events",
  ),

  QSTASH_URL: String(
    process.env.QSTASH_URL || "https://qstash-eu-central-1.upstash.io",
  ),
  QSTASH_TOKEN: String(process.env.QSTASH_TOKEN || "secret.jwt.token"),
  QSTASH_CURRENT_SIGNING_KEY:
    String(process.env.QSTASH_CURRENT_SIGNING_KEY) || "secret_key",
  QSTASH_NEXT_SIGNING_KEY: String(
    process.env.QSTASH_NEXT_SIGNING_KEY || "secret_key",
  ),
};

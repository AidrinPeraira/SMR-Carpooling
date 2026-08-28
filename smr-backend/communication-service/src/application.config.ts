import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4005,
  NODE_ENV: String(process.env.NODE_ENV || "development"),

  MONGO_DB_URL: String(process.env.MONGO_DB_URL),

  API_GATEWAY_KEY: String(
    process.env.API_GATEWAY_KEY ||
      "smr_gateway_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe",
  ),

  RABBITMQ_URL: String(process.env.RABBITMQ_URL || "amqp://localhost:5672"),
  RABBITMQ_EXCHANGE_NAME: String(
    process.env.RABBITMQ_EXCHANGE_NAME || "sharemyride.events",
  ),
};

import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4004,
  NODE_ENV: String(process.env.NODE_ENV) || "development",
  API_GATEWAY_KEY: String(
    process.env.API_GATEWAY_KEY ||
      "smr_gateway_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe",
  ),

  MONGO_DB_URL: String(process.env.MONGO_DB_URL),

  RABBITMQ_URL: String(process.env.RABBITMQ_URL || "amqp://localhost:5672"),
  RABBITMQ_EXCHANGE_NAME: String(
    process.env.RABBITMQ_EXCHANGE_NAME || "sharemyride.events",
  ),

  RAZORPAY_API_KEY: String(process.env.RAZORPAY_API_KEY || "api_key"),
  RAZORPAY_API_SECRET: String(process.env.RAZORPAY_API_SECRET || "api_secret"),
  PAYMENT_SECRET: String(process.env.PAYMENT_SECRET || "secret_key"),
};

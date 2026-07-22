import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: String(process.env.NODE_ENV) || "development",

  RESEND_API_KEY: String(process.env.RESEND_API_KEY) || "resend-api-key",
  RESEND_EMAIL_FROM:
    String(process.env.RESEND_EMAIL_FROM) || "email@noreply.com",

  FRONTEND_URL: String(process.env.FRONTEND_URL) || "https://localhost:3000",

  RABBITMQ_URL: String(process.env.RABBITMQ_URL) || "amqp://localhost:5672",
  RABBITMQ_EXCHANGE_NAME:
    String(process.env.RABBITMQ_EXCHANGE_NAME) || "sharemyride.events",
  RABBITMQ_QUEUE_NAME:
    String(process.env.RABBITMQ_QUEUE_NAME) || "smr.notifications.queue",

  API_GATEWAY_KEY: String(
    process.env.API_GATEWAY_KEY ||
      "smr_gateway_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe",
  ),
};

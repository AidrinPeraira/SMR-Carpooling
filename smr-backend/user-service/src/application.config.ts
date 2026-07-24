import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: String(process.env.NODE_ENV || "development"),
  CUSTOM_ID_LENGTH: Number(process.env.CUSTOM_ID_LENGTH) || 6,
  TOKEN_LIFE_MINUTES: Number(process.env.TOKEN_LIFE_MINUTES) || 10,

  MONGO_DB_URL: String(process.env.MONGO_DB_URL),
  REDIS_URL: String(process.env.REDIS_URL),

  GENERIC_SECRET: String(process.env.GENERIC_SECRET || "random-secret-key"),
  ACCESS_TOKEN_SECRET: String(
    process.env.ACCESS_TOKEN_SECRET || "random-secret-key",
  ),
  REFRESH_TOKEN_SECRET: String(
    process.env.REFRESH_TOKEN_SECRET || "random-secret-key",
  ),

  ACCESS_TOKEN_LIFE_SECONDS: Number(
    process.env.ACCESS_TOKEN_LIFE_SECONDS || 900,
  ),
  REFRESH_TOKEN_LIFE_SECONDS: Number(
    process.env.REFRESH_TOKEN_LIFE_SECONDS || 172800,
  ),

  RABBITMQ_URL: String(process.env.RABBITMQ_URL || "amqp://localhost:5672"),
  RABBITMQ_EXCHANGE_NAME: String(
    process.env.RABBITMQ_EXCHANGE_NAME || "sharemyride.events",
  ),

  GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
  GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),

  API_GATEWAY_KEY: String(
    process.env.API_GATEWAY_KEY ||
      "smr_gateway_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe",
  ),

  UPLOAD_URL_TTL_SECONDS: Number(process.env.UPLOAD_URL_TTL_SECONDS) || 300,
  MAX_AVATAR_SIZE_BYTES:
    Number(process.env.MAX_AVATAR_SIZE_BYTES) * 1024 * 1024 || 5 * 1024 * 1024,

  S3_API_URL: String(process.env.S3_API_URL) || "abc",

  S3_BUCKET_NAME: String(process.env.S3_BUCKET_NAME) || "sharemyride-bucket",
  S3_ACCESS_ID: String(process.env.S3_ACCESS_ID) || "123",
  S3_SECRET_KEY: String(process.env.S3_SECRET_KEY) || "asdf",
  S3_PUBLIC_DOMAIN: String(process.env.S3_PUBLIC_DOMAIN) || "",
};

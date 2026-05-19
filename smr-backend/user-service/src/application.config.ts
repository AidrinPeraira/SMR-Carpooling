import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: String(process.env.NODE_ENV) || "development",
  CUSTOM_ID_LENGTH: Number(process.env.CUSTOM_ID_LENGTH) || 6,
  TOKEN_LIFE_MINUTES: Number(process.env.TOKEN_LIFE_MINUTES) || 10,
};

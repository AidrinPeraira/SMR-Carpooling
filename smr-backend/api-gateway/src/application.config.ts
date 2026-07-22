import "dotenv/config";

export const AppConfig = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: String(process.env.NODE_ENV) || "development",
  USER_SERVICE_URL:
    String(process.env.USER_SERVICE_URL) || "https://localhost:4001",
  ACCESS_TOKEN_SECRET:
    String(process.env.ACCESS_TOKEN_SECRET || "nic4B4Z3XbOvV8RxRdXkrb8KDWIXnGZFRzy0p4Qr8ds"),
  FRONTEND_KEY:
    String(process.env.FRONTEND_KEY || "smr_frontend_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe"),
  API_GATEWAY_KEY:
    String(process.env.API_GATEWAY_KEY || "smr_gateway_u4v9fPrcueOb7dvkezvUadzTCZWs1wKe"),
  REDIS_URL:
    String(process.env.REDIS_URL || "redis://localhost:6379"),
};

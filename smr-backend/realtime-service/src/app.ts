import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { HttpStatusCodes, type ILogger } from "@sharemyride/shared";
import { metricsMiddleware } from "#/presentation/middleware/http-metrics.middleware";
import { gatewayKeyMiddleware } from "#/presentation/middleware/gateway-key.middleware";

export function createApp(logger: ILogger) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());

  app.use(gatewayKeyMiddleware);
  app.use(metricsMiddleware);

  app.use(
    morgan("dev", {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    }),
  );

  app.get("/health", (_req, res) => {
    res.status(HttpStatusCodes.Ok).json({ status: "OK" });
  });

  return app;
}

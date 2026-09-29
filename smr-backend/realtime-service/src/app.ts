import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { HttpStatusCodes } from "@sharemyride/shared";
import { metricsMiddleware } from "#/presentation/middleware/http-metrics.middleware";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());

  app.use(metricsMiddleware);

  app.get("/health", (_req, res) => {
    res.status(HttpStatusCodes.Ok).json({ status: "OK" });
  });

  return app;
}

import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { HttpStatusCodes, type ILogger } from "@smr/shared";
import { mapError } from "./utils/error-mapper";

export function createApp(logger: ILogger) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());

  app.get("/health", (_req, res) => {
    res.status(HttpStatusCodes.Ok).json({ status: "OK" });
  });

  //global error handler
  app.use((err: unknown, req: Request, res: Response) => {
    const mappedError = mapError(err, "user-service");

    logger.error(mappedError.message, {
      origin: mappedError.origin,
      errorCode: mappedError.errorCode,
      details: mappedError.details,
      statusCode: mappedError.statusCode,
      stack: mappedError.stack,
      internalError: mappedError.cause,
      url: req.url,
      method: req.method,
    });

    return res.status(mappedError.statusCode).json({
      success: false,
      message: mappedError.message,
      errorCode: mappedError.errorCode,
      details: mappedError.details,
    });
  });

  return app;
}

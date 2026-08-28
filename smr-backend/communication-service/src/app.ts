import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import {
  HttpStatusCodes,
  makeFailedResponse,
  type ILogger,
} from "@sharemyride/shared";
import morgan from "morgan";
import { keyMiddleware } from "#/presentation/middlewares/key.middleware";


/**
 * Express Application Factory.
 * Configures middleware, health checks, versioned routes, and global error handling.
 *
 * @param logger - The logger instance to be used across the application lifecycle.
 * @returns The configured Express Application instance.
 */
export function createApp(logger: ILogger) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(
    morgan("dev", {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    }),
  );

  app.use(keyMiddleware);

  app.get("/health", (_req, res) => {
    res.status(HttpStatusCodes.Ok).json({ status: "OK" });
  });

  //global error handler
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", {
      error: err instanceof Error ? err.message : String(err),
      url: req.url,
      method: req.method,
    });
    res
      .status(HttpStatusCodes.InternalServerError)
      .json(
        makeFailedResponse(
          "Internal Server Error",
          "INTERNAL_ERROR",
        ),
      );
  });

  return app;
}

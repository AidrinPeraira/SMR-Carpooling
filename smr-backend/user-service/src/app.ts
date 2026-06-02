import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { HttpStatusCodes, makeFailedResponse, type ILogger } from "@smr/shared";
import { mapError } from "./presentation/utils/error-mapper";
import { userServiceRouters } from "#/presentation/user-service.module";

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

  app.get("/health", (_req, res) => {
    res.status(HttpStatusCodes.Ok).json({ status: "OK" });
  });

  //routes
  app.use("/v1", userServiceRouters.v1);

  //global error handler
  app.use((err: unknown, req: Request, res: Response) => {
    const mappedError = mapError(err);

    logger.error(mappedError.message, {
      errorCode: mappedError.errorCode,
      details: mappedError.details,
      statusCode: mappedError.statusCode,
      stack: mappedError.stack,
      internalError: mappedError.cause,
      url: req.url,
      method: req.method,
    });
    return res
      .status(mappedError.statusCode)
      .json(
        makeFailedResponse(
          mappedError.message,
          mappedError.errorCode,
          mappedError.details,
        ),
      );
  });

  return app;
}

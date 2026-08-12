import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {
  HttpStatusCodes,
  makeFailedResponse,
  type ILogger,
} from "@sharemyride/shared";
import { tripServiceRouters } from "#/presentation/trip-service.module";
import { mapError } from "#/presentation/utils/error-mapper";
import { keyMiddleware } from "#/presentation/middleware/key.middleware";

export function createApp(logger: ILogger) {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cors());
  app.use(helmet());
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

  app.use(keyMiddleware);

  // routes
  app.use("/v1", tripServiceRouters.v1);

  // global error handler
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
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

    res
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

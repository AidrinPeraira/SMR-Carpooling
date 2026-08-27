import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import {
  HttpStatusCodes,
  makeFailedResponse,
  type ILogger,
} from "@sharemyride/shared";
import { keyMiddleware } from "#/presentation/middleware/key.middleware";
import { paymentServiceRouters } from "#/presentation/payment-service.module";
import { mapError } from "#/presentation/utils/error-mapper";

export function createApp(logger: ILogger) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());

  app.get("/health", (_req, res) => {
    res.status(HttpStatusCodes.Ok).json({ status: "OK" });
  });

  app.use(keyMiddleware);

  // Versioned API Routes
  app.use("/v1", paymentServiceRouters.v1);

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

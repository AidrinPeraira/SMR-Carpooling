import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { ApplicationError, HttpStatusCodes, type ILogger } from "@smr/shared";

export function createApp(logger: ILogger) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());

  app.get("/health", (req, res) => {
    res.status(HttpStatusCodes.Ok).json({ status: "OK" });
  });

  //global error handler
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApplicationError) {
      logger.error(err.message, {
        origin: err.origin,
        errorCode: err.errorCode,
        details: err.details,
        statusCode: err.statusCode,
        stack: err.stack,
        internalError: err.err,
      });

      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errorCode: err.errorCode,
        details: err.details,
      });
    }

    // Unhandled errors
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    const errorStack = err instanceof Error ? err.stack : undefined;

    logger.error(errorMessage, {
      stack: errorStack,
      url: req.url,
      method: req.method,
    });

    res.status(HttpStatusCodes.InternalServerError).json({
      success: false,
      message: "An unexpected error occurred",
    });
  });

  return app;
}

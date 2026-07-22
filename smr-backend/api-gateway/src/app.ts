import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import {
  ApplicationError,
  HttpStatusCodes,
  makeFailedResponse,
  type ILogger,
} from "@sharemyride/shared";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { AppConfig } from "#/application.config";
import morgan from "morgan";
import { authMiddleware } from "#/middleware/auth.middleware";
import { keyMiddleware } from "#/middleware/key.middleware";

export function createApp(logger: ILogger) {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  //middlewares
  app.use(keyMiddleware);
  app.use(authMiddleware);

  //Http Proxy Implementaion
  //we will create and use more instances like this to forward requests to the other services
  const userServiceProxy = createProxyMiddleware<Request, Response>({
    target: AppConfig.USER_SERVICE_URL,
    changeOrigin: true,
    pathFilter: [
      "/api/*/auth/**",
      "/api/*/profile/**",
      "/api/*/admin/users/**",
    ],
    pathRewrite: {
      "^/api": "",
    },
    on: {
      proxyReq: (proxyReq, req) => {
        // proxyReq.setHeader("x-gateway-key", AppConfig.API_GATEWAY_KEY);
        fixRequestBody(proxyReq, req);
      },
      error: (error: unknown, _req, res) => {
        logger.error("User service proxy error: ", error);
        if ("status" in res) {
          res
            .status(HttpStatusCodes.BadGateway)
            .json(makeFailedResponse("User service is unavailable"));
        }
      },
    },
  });

  app.use(userServiceProxy);

  //global error handler
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApplicationError) {
      logger.error(err.message, {
        message: err.message,
        errorCode: err.errorCode,
        details: err.details,
        statusCode: err.statusCode,
        stack: err.stack,
        internalError: err.cause,
      });

      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errorCode: err.errorCode,
        details: err.details,
      });
    }

    // Unhandled errors
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
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

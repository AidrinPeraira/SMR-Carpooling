import { createPassengerMcpServer, createDriverMcpServer } from "#/tools/index";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { makeFailedResponse } from "@sharemyride/shared";
import { logger } from "#/services/LoggerService";
import { mapError } from "#/utils/error-mapper";
import { AppConfig } from "#/application.config";

export async function createApp() {
  const passengerHandler = createMcpHandler(() => createPassengerMcpServer());
  const driverHandler = createMcpHandler(() => createDriverMcpServer());

  const app = createMcpExpressApp({ host: "0.0.0.0" });

  const morganFormat = AppConfig.NODE_ENV === "production" ? "combined" : "dev";
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
      skip: (req) => req.url === "/mcp/health",
    }),
  );

  app.get("/mcp/health", (_req, res) => {
    res.status(HttpStatusCode.Ok).json({ status: "OK" });
  });

  const passengerNode = toNodeHandler(passengerHandler);
  const driverNode = toNodeHandler(driverHandler);

  app.all(
    "/mcp/passenger",
    (req, res) => void passengerNode(req, res, req.body),
  );
  app.all("/mcp/driver", (req, res) => void driverNode(req, res, req.body));

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
      .json(makeFailedResponse(mappedError.message, mappedError.errorCode));
  });

  return app;
}

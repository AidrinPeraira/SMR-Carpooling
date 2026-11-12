import { type Request, type Response, type NextFunction } from "express";
import type { IncomingMessage, ServerResponse } from "node:http";
import { HttpStatusCodes, makeFailedResponse } from "@sharemyride/shared";
import { AppConfig } from "#/application.config";

/**
 * This middleware checks the custom secret key header
 */
export function gatewayKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const path = req.path ?? req.url ?? "";
  if (path === "/health" || path.startsWith("/v1/webhook")) {
    return next();
  }

  const gateway = req.headers["x-gateway-key"];
  if (!gateway || gateway !== AppConfig.API_GATEWAY_KEY) {
    return res
      .status(HttpStatusCodes.Forbidden)
      .json(
        makeFailedResponse(
          "Forbidden: Request must originate from a verified gateway",
        ),
      );
  }

  next();
}

export function engineGatewayKeyMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void,
) {
  const path = req.url ?? "";
  if (path === "/health" || path.startsWith("/v1/webhook")) {
    return next();
  }

  const gateway = req.headers["x-gateway-key"];
  if (!gateway || gateway !== AppConfig.API_GATEWAY_KEY) {
    res.writeHead(HttpStatusCodes.Forbidden, { "Content-Type": "application/json" });
    res.end(JSON.stringify(
      makeFailedResponse("Forbidden: Request must originate from a verified gateway"),
    ));
    return;
  }

  next();
}

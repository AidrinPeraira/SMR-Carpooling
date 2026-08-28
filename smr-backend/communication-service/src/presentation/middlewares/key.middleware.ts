import { type Request, type Response, type NextFunction } from "express";
import { HttpStatusCodes, makeFailedResponse } from "@sharemyride/shared";
import { AppConfig } from "#/application.config";

/**
 * This middleware checks the custom secret key header
 */
export function keyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/health" || req.path.startsWith("/v1/webhook")) {
    return next();
  }

  const frontendKey = req.headers["x-gateway-key"];
  if (!frontendKey || frontendKey !== AppConfig.API_GATEWAY_KEY) {
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

import { type Request, type Response, type NextFunction } from "express";
import { HttpStatusCodes, makeFailedResponse } from "@sharemyride/shared";
import { AppConfig } from "#/application.config";

/**
 * This middleware checks the custom secret key header
 */
export function keyMiddleware(req: Request, res: Response, next: NextFunction) {
  //health check probably comes from some outside service
  //so exclude that path
  if (req.path === "/health" || req.path.startsWith("/api/v1/webhook")) {
    req.headers["x-gateway-key"] = AppConfig.API_GATEWAY_KEY;
    return next();
  }

  //check for valid frontend
  const frontendKey = req.headers["x-frontend-key"];
  if (!frontendKey || frontendKey !== AppConfig.FRONTEND_KEY) {
    res
      .status(HttpStatusCodes.Forbidden)
      .json(
        makeFailedResponse(
          "Forbidden: Request must originate from a verified client",
        ),
      );
    return;
  }

  //attatch gateway key
  req.headers["x-gateway-key"] = AppConfig.API_GATEWAY_KEY;

  next();
}

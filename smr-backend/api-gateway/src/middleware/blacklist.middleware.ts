import { type Request, type Response, type NextFunction } from "express";
import { HttpStatusCodes, makeFailedResponse } from "@sharemyride/shared";
import { blacklistService } from "#/services/blacklist.service";

const PUBLIC_PATHS = [
  "/health",
  "/api/v1/auth/login",
  "/api/v1/auth/signup",
  "/api/v1/auth/google",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/refresh-token",
  "/api/v1/auth/change-password",
  "/api/v1/auth/forgot-password",
  "/api/v1/webhook",
  "/socket.io",
];

/**
 * This middleware checks if authenticated users are blacklisted.
 * It takes the user id from headers set by auth middleware and
 * checks it with the redis store's blacklisted users' list.
 */
export async function blacklistMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //skip auth for public routes
  const isPublic = PUBLIC_PATHS.some((path) => req.path.startsWith(path));
  if (isPublic) {
    return next();
  }

  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res
        .status(HttpStatusCodes.Unauthorized)
        .json(makeFailedResponse("Authentication header not verified!"));
    }

    const isBlacklisted = await blacklistService.isSessionBlacklisted(userId);

    if (isBlacklisted) {
      return res
        .status(HttpStatusCodes.Forbidden)
        .json(makeFailedResponse("Account has been blocked"));
    }
  } catch (error) {
    console.error("Blacklist middleware error:", error);
    return res
      .status(HttpStatusCodes.Unauthorized)
      .json(makeFailedResponse("Authentication header not verified!"));
  }

  next();
}

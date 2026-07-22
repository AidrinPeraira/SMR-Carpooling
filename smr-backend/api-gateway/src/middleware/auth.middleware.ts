import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCodes, makeFailedResponse } from "@sharemyride/shared";
import { AppConfig } from "#/application.config";
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
];

/**
 * This middleware validates autorization header token
 * for access and checks if user is in session blacklist
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //skip auth for public routes
  const isPublic = PUBLIC_PATHS.some((path) => req.path.startsWith(path));
  if (isPublic) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(HttpStatusCodes.Unauthorized)
      .json(makeFailedResponse("Authorization token missing or malformed"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(HttpStatusCodes.Unauthorized)
      .json(makeFailedResponse("Authorization token is missing"));
  }

  try {
    const secret = AppConfig.ACCESS_TOKEN_SECRET;
    const payload = jwt.verify(token, secret) as any;
    const userId = payload.user.userId;

    // Check if user is blacklisted
    const isBlacklisted = await blacklistService.isSessionBlacklisted(userId);
    if (isBlacklisted) {
      return res
        .status(HttpStatusCodes.Forbidden)
        .json(makeFailedResponse("Account has been blocked"));
    }

    //make custom headers for other services to read
    req.headers["x-user-id"] = payload.user.userId;
    req.headers["x-user-role"] = payload.user.userRole;
    req.headers["x-user-email"] = payload.user.emailId;
    req.headers["x-user-first-name"] = payload.user.firstName;
    req.headers["x-user-last-name"] = payload.user.lastName;

    next();
  } catch (error: unknown) {
    console.log("Auth middleware error: ", error);
    return res
      .status(HttpStatusCodes.Unauthorized)
      .json(makeFailedResponse("Invalid or expired authorization token"));
  }
}

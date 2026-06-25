import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCodes, makeFailedResponse } from "@smr/shared";
import { AppConfig } from "#/application.config";

const PUBLIC_PATHS = [
  "/health",
  "/api/v1/auth/login",
  "/api/v1/auth/signup",
  "/api/v1/auth/google",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/refresh-token",
];

/**
 * This middleware validates autorization header token
 * for access
 */
export function authMiddleware(
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

    //make cutom headers for other services to read
    req.headers["x-user-id"] = payload.user.userId;
    req.headers["x-user-role"] = payload.user.userRole;
    req.headers["x-user-email"] = payload.user.emailId;
    req.headers["x-user-first-name"] = payload.user.firstName;
    req.headers["x-user-last-name"] = payload.user.lastName;

    next();
  } catch (error) {
    return res
      .status(HttpStatusCodes.Unauthorized)
      .json(makeFailedResponse("Invalid or expired authorization token"));
  }
}

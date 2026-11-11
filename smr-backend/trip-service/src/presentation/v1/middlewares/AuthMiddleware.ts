import { Request, Response, NextFunction } from "express";
import {
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
  UserRole,
} from "@sharemyride/shared";

export function AuthMiddleware(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const reqRole = req.headers["x-user-role"] as string;
    const reqUserId = req.headers["x-user-id"] as string;

    if (!reqRole || !reqUserId) {
      throw new ApplicationError(
        GenericErrorMessage.UNAUTHORIZED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.INPUT_UNAUTHORIZED,
        {
          location: "AuthMiddleware",
          description:
            "Missing required authentication headers (x-user-role or x-user-id)",
        },
      );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(reqRole as UserRole)) {
      throw new ApplicationError(
        GenericErrorMessage.UNAUTHORIZED,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        {
          location: "AuthMiddleware",
          description: `User role '${reqRole}' is not allowed to access this resource. Allowed roles: ${allowedRoles.join(", ")}`,
        },
      );
    }

    next();
  };
}

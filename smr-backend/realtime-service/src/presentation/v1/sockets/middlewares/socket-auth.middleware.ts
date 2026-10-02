import { ExtendedError, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { AppConfig } from "#/application.config";

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: ExtendedError) => void,
) {
  const token = socket.handshake.auth.token as string | undefined;

  if (!token) {
    return next(new Error("Authorization token is missing"));
  }

  try {
    const secret = AppConfig.ACCESS_TOKEN_SECRET;
    const payload = jwt.verify(token, secret) as {
      user: { userId: string; firstName: string; lastName: string };
    };

    socket.data.userId = payload.user.userId;
    socket.data.userName = `${payload.user.firstName} ${payload.user.lastName}`;

    next();
  } catch {
    next(new Error("Invalid or expired authorization token"));
  }
}

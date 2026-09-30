import { ExtendedError, Socket } from "socket.io";

/**
 * This middleware checks the custom secret key header
 */
export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: ExtendedError) => void,
) {
  const token = socket.handshake.auth.token;

  //add code to check and verify the auth token
  if (!token) {
    next(new Error("Invalid Token"));
  }

  next();
}

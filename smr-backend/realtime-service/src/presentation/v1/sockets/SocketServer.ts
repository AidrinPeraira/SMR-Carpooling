import { gatewayKeyMiddleware } from "#/presentation/middleware/gateway-key.middleware";
import { socketAuthMiddleware } from "#/presentation/v1/sockets/middlewares/socket-auth.middleware";
import { ILogger } from "@sharemyride/shared";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export function createSocketServer(httpServer: HttpServer, logger: ILogger) {
  //create a new socket instance
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  //directly using the express middleware
  io.engine.use(gatewayKeyMiddleware);

  //custom middleware for scoket requests
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    //the socket object we get from the callback is for
    //each connection to the socket server.
    //(io represents the server itself, socket is the connection)
    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });

    //error handling
    socket.on("connect_error", (err) => {
      logger.error(err.message);
    });
  });

  return io;
}

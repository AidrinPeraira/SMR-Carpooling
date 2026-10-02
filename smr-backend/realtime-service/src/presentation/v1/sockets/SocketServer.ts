import { getRedisClient } from "#/infrastructure/store/connect-redis";
import { gatewayKeyMiddleware } from "#/presentation/middleware/gateway-key.middleware";
import { ISocketHandler } from "#/presentation/v1/sockets/interfaces/ISocketHandler";
import { socketAuthMiddleware } from "#/presentation/v1/sockets/middlewares/socket-auth.middleware";
import { ILogger } from "@sharemyride/shared";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

export async function createSocketServer(httpServer: HttpServer) {
  //clone the redis client instances for socket room pub sub
  const masterRedisClient = getRedisClient();
  const pubClient = masterRedisClient.duplicate();
  const subClient = masterRedisClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  // create a new socket server
  const io = new Server(httpServer, {
    cors: {
      allowedHeaders: "*",
    },
    adapter: createAdapter(pubClient, subClient),
  });

  //directly using the express middleware
  io.engine.use(gatewayKeyMiddleware);

  return io;
}

export async function registerSocketHandlers(
  io: Server,
  handlers: ISocketHandler[],
  logger: ILogger,
) {
  //since we are using routing of socket connections using
  //namespaces we set up each handler with its namesapce
  for (const handler of handlers) {
    //custom middleware for socket requests
    io.of(handler.nameSpace).use(socketAuthMiddleware);

    io.of(handler.nameSpace).on("connection", (socket) => {
      logger.info("Socket connection established: ", {
        socketId: socket.id,
      });

      socket.on("connection_error", (error) => {
        logger.error("Socket connection failed. Error: ", { error: error });
      });

      handler.register(socket);

      //to track if user is connected
      //this enables tracking the same user across multiple devices also
      socket.join(`user:${socket.data.userId}`);
    });
  }
}

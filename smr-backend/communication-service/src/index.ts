import "dotenv/config";
import { createApp } from "#/app";
import { AppConfig } from "#/application.config";
import { ConsolaLogger } from "@sharemyride/shared";
import { connectMongoDB } from "#/infrastructure/database/connect-mongodb";
import { eventBus } from "#/presentation/communication-service.module";
import { memberRepository, chatRepository } from "#/presentation/communication-service.module";
import { MessageRepository } from "#/infrastructure/repository/MessageRepository";
import { HandleUserConnectUseCase } from "#/application/use-cases/chat-messaging/HandleUserConnectUseCase";
import { HandleUserDisconnectUseCase } from "#/application/use-cases/chat-messaging/HandleUserDisconnectUseCase";
import { JoinChatUseCase } from "#/application/use-cases/chat-messaging/JoinChatUseCase";
import { SendMessageUseCase } from "#/application/use-cases/chat-messaging/SendMessageUseCase";
import { SyncChatHistoryUseCase } from "#/application/use-cases/chat-messaging/SyncChatHistoryUseCase";
import { createSocketServer } from "#/presentation/v1/sockets/CreateSocketServer";
import { Server } from "socket.io";
import { SocketIOGateway } from "#/infrastructure/services/SocketIOGateway";

async function startServer(): Promise<void> {
  const logger = new ConsolaLogger();

  await connectMongoDB(logger);
  await eventBus.connect();

  const app = createApp(logger);
  const PORT = Number(AppConfig.PORT);

  const httpServer = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`The communication-service is running at port: ${PORT}.`);
  });

  const messageRepository = new MessageRepository();
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const socketGateway = new SocketIOGateway(io);

  const handleUserConnectUseCase = new HandleUserConnectUseCase(memberRepository, chatRepository, socketGateway);
  const handleUserDisconnectUseCase = new HandleUserDisconnectUseCase(socketGateway);
  const joinChatUseCase = new JoinChatUseCase(chatRepository, socketGateway);
  const sendMessageUseCase = new SendMessageUseCase(chatRepository, memberRepository, messageRepository, socketGateway);
  const syncChatHistoryUseCase = new SyncChatHistoryUseCase(chatRepository, messageRepository);

  createSocketServer(
    io,
    socketGateway,
    handleUserConnectUseCase,
    handleUserDisconnectUseCase,
    joinChatUseCase,
    sendMessageUseCase,
    syncChatHistoryUseCase
  );
}

startServer().catch((error: unknown) => {
  const logger = new ConsolaLogger();
  logger.error("Failed to start the communication-service server", {
    error: error instanceof Error ? error.message : String(error),
  });
});

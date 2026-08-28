import { Server, Socket } from "socket.io";
import { SocketIOGateway } from "#/infrastructure/services/SocketIOGateway";
import { HandleUserConnectUseCase } from "#/application/use-cases/chat-messaging/HandleUserConnectUseCase";
import { HandleUserDisconnectUseCase } from "#/application/use-cases/chat-messaging/HandleUserDisconnectUseCase";
import { JoinChatUseCase } from "#/application/use-cases/chat-messaging/JoinChatUseCase";
import { SendMessageUseCase } from "#/application/use-cases/chat-messaging/SendMessageUseCase";
import { SyncChatHistoryUseCase } from "#/application/use-cases/chat-messaging/SyncChatHistoryUseCase";

export const createSocketServer = (
  io: Server,
  socketGateway: SocketIOGateway,
  handleUserConnectUseCase: HandleUserConnectUseCase,
  handleUserDisconnectUseCase: HandleUserDisconnectUseCase,
  joinChatUseCase: JoinChatUseCase,
  sendMessageUseCase: SendMessageUseCase,
  syncChatHistoryUseCase: SyncChatHistoryUseCase,
): Server => {

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth.userId as string;

    if (!userId) {
      socket.disconnect();
      return;
    }

    socketGateway.registerSocket(userId, socket);
    void handleUserConnectUseCase.execute(userId);

    socket.on("join_chat", async (payload: { chatId: string }) => {
      try {
        await joinChatUseCase.execute(userId, payload.chatId, socket.id);
      } catch (error) {
        socket.emit("error", { message: error instanceof Error ? error.message : "Failed to join chat" });
      }
    });

    socket.on("send_message", async (payload: { chatId: string; body: string }) => {
      try {
        await sendMessageUseCase.execute({
          chatId: payload.chatId,
          body: payload.body,
          senderId: userId,
        });
      } catch (error) {
        socket.emit("error", { message: error instanceof Error ? error.message : "Failed to send message" });
      }
    });

    socket.on("sync_history", async (payload: { chatId: string }) => {
      try {
        const history = await syncChatHistoryUseCase.execute(payload.chatId, userId);
        socket.emit("chat_history", history);
      } catch (error) {
        socket.emit("error", { message: error instanceof Error ? error.message : "Failed to sync history" });
      }
    });

    socket.on("disconnect", () => {
      socketGateway.removeSocket(userId, socket.id);
      void handleUserDisconnectUseCase.execute(userId);
    });
  });

  return io;
};

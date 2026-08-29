import { Server, Socket } from "socket.io";
import { SocketIOGateway } from "#/infrastructure/services/SocketIOGateway";
import { HandleUserConnectUseCase } from "#/application/use-cases/chat-messaging/HandleUserConnectUseCase";
import { HandleUserDisconnectUseCase } from "#/application/use-cases/chat-messaging/HandleUserDisconnectUseCase";
import { JoinChatUseCase } from "#/application/use-cases/chat-messaging/JoinChatUseCase";
import { SendMessageUseCase } from "#/application/use-cases/chat-messaging/SendMessageUseCase";
import { SyncChatHistoryUseCase } from "#/application/use-cases/chat-messaging/SyncChatHistoryUseCase";
import { InitiateCallUseCase } from "#/application/use-cases/call/InitiateCallUseCase";
import { AcceptCallUseCase } from "#/application/use-cases/call/AcceptCallUseCase";
import { RejectCallUseCase } from "#/application/use-cases/call/RejectCallUseCase";
import { EndCallUseCase } from "#/application/use-cases/call/EndCallUseCase";
import { RelayCallSignalUseCase } from "#/application/use-cases/call/RelayCallSignalUseCase";
import {
  InitiateCallRequestDTO,
  AcceptCallRequestDTO,
  RejectCallRequestDTO,
  RelayCallSignalRequestDTO,
} from "#/application/dto/CallDTO";

export const createSocketServer = (
  io: Server,
  socketGateway: SocketIOGateway,
  handleUserConnectUseCase: HandleUserConnectUseCase,
  handleUserDisconnectUseCase: HandleUserDisconnectUseCase,
  joinChatUseCase: JoinChatUseCase,
  sendMessageUseCase: SendMessageUseCase,
  syncChatHistoryUseCase: SyncChatHistoryUseCase,
  initiateCallUseCase: InitiateCallUseCase,
  acceptCallUseCase: AcceptCallUseCase,
  rejectCallUseCase: RejectCallUseCase,
  endCallUseCase: EndCallUseCase,
  relayCallSignalUseCase: RelayCallSignalUseCase,
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
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to join chat",
        });
      }
    });

    socket.on(
      "send_message",
      async (payload: { chatId: string; body: string }) => {
        try {
          await sendMessageUseCase.execute({
            chatId: payload.chatId,
            body: payload.body,
            senderId: userId,
          });
        } catch (error) {
          socket.emit("error", {
            message:
              error instanceof Error ? error.message : "Failed to send message",
          });
        }
      },
    );

    socket.on("sync_history", async (payload: { chatId: string }) => {
      try {
        const history = await syncChatHistoryUseCase.execute(
          payload.chatId,
          userId,
        );
        socket.emit("chat_history", history);
      } catch (error) {
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to sync history",
        });
      }
    });

    socket.on("initiate_call", async (payload: InitiateCallRequestDTO) => {
      try {
        payload.callerId = userId;
        await initiateCallUseCase.execute(payload);
      } catch (error) {
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to initiate call",
        });
      }
    });

    socket.on("accept_call", async (payload: AcceptCallRequestDTO) => {
      try {
        await acceptCallUseCase.execute(payload);
      } catch (error) {
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to accept call",
        });
      }
    });

    socket.on("reject_call", async (payload: RejectCallRequestDTO) => {
      try {
        await rejectCallUseCase.execute(payload);
      } catch (error) {
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to reject call",
        });
      }
    });

    socket.on("end_call", async (payload: { callSessionId: string }) => {
      try {
        await endCallUseCase.execute(payload.callSessionId);
      } catch (error) {
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to end call",
        });
      }
    });

    socket.on("relay_signal", async (payload: RelayCallSignalRequestDTO) => {
      try {
        payload.senderUserId = userId;
        await relayCallSignalUseCase.execute(payload);
      } catch (error) {
        socket.emit("error", {
          message:
            error instanceof Error ? error.message : "Failed to relay signal",
        });
      }
    });

    socket.on("disconnect", () => {
      socketGateway.removeSocket(userId, socket.id);
      void handleUserDisconnectUseCase.execute(userId);
    });
  });

  return io;
};

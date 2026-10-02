import { IJoinTripChatUseCase } from "#/application/interfaces/use-cases/chat-message/IJoinTripChatUseCase";
import { ILeaveTripChatUseCase } from "#/application/interfaces/use-cases/chat-message/ILeaveTripChatUseCase";
import { ISendMessageUseCase } from "#/application/interfaces/use-cases/chat-message/ISendMessageUseCase";
import { IChatSocketHandler } from "#/presentation/v1/sockets/interfaces/IChatSocketHandler";
import { ChatSocketMapper } from "#/application/mapper/ChatSocketMapper";
import { Trace } from "#/presentation/utils/traces-decorator";
import {
  ILogger,
  SocketEvents,
  zodParser,
  JoinTripChatSchema,
  JoinTripChatDTO,
  LeaveTripChatSchema,
  LeaveTripChatDTO,
  SendChatMessageSchema,
  SendChatMessageDTO,
  ApplicationError,
} from "@sharemyride/shared";
import { Socket } from "socket.io";

export class ChatSocketHandler implements IChatSocketHandler {
  constructor(
    readonly nameSpace: string,
    private readonly _logger: ILogger,
    private readonly _joinTripChatUseCase: IJoinTripChatUseCase,
    private readonly _leaveTripChatUseCase: ILeaveTripChatUseCase,
    private readonly _sendMessageUseCase: ISendMessageUseCase,
  ) {}

  async register(socket: Socket): Promise<void> {
    socket.on(SocketEvents.JOIN_CHAT, (payload: unknown) =>
      this.onJoinChat(socket, payload),
    );

    socket.on(SocketEvents.LEAVE_CHAT, (payload: unknown) =>
      this.onLeaveChat(socket, payload),
    );

    socket.on(SocketEvents.SEND_MESSAGE, (payload: unknown) =>
      this.onSendMessage(socket, payload),
    );

    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  @Trace("chat-socket-handler")
  async onJoinChat(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<JoinTripChatDTO>(
        JoinTripChatSchema,
        payload,
      );

      const dto = ChatSocketMapper.toJoinTripChatRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._joinTripChatUseCase.execute(dto, socket.id);
    } catch (error) {
      this._logger.error("ChatSocketHandler.onJoinChat error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("chat-socket-handler")
  async onLeaveChat(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<LeaveTripChatDTO>(
        LeaveTripChatSchema,
        payload,
      );

      const dto = ChatSocketMapper.toLeaveTripChatRequestDTO(validated);

      await this._leaveTripChatUseCase.execute(dto, socket.id);
    } catch (error) {
      this._logger.error("ChatSocketHandler.onLeaveChat error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("chat-socket-handler")
  async onSendMessage(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<SendChatMessageDTO>(
        SendChatMessageSchema,
        payload,
      );

      const dto = ChatSocketMapper.toSendMessageRequestDTO(
        validated,
        socket.data.userId as string,
        socket.data.userName as string,
      );

      await this._sendMessageUseCase.execute(dto);
    } catch (error) {
      this._logger.error("ChatSocketHandler.onSendMessage error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("chat-socket-handler")
  async onDisconnect(socket: Socket): Promise<void> {
    this._logger.info("Socket disconnected", { socketId: socket.id });
  }

  private emitError(socket: Socket, error: unknown): void {
    const message =
      error instanceof ApplicationError
        ? error.message
        : "An unexpected error occurred";

    socket.emit(SocketEvents.CHAT_ERROR, { message });
  }
}

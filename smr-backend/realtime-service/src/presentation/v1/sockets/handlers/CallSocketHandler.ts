import { IInitiateCallUseCase } from "#/application/interfaces/use-cases/call/IInitiateCallUseCase";
import { IAcceptCallUseCase } from "#/application/interfaces/use-cases/call/IAcceptCallUseCase";
import { IRejectCallUseCase } from "#/application/interfaces/use-cases/call/IRejectCallUseCase";
import { IHandleCallTimeoutUseCase } from "#/application/interfaces/use-cases/call/IHandleCallTimeoutUseCase";
import { IEndCallUseCase } from "#/application/interfaces/use-cases/call/IEndCallUseCase";
import { IRelayCallSignalUseCase } from "#/application/interfaces/use-cases/call/IRelayCallSignalUseCase";
import { ICallSocketHandler } from "#/presentation/v1/sockets/interfaces/ICallSocketHandler";
import { CallSocketMapper } from "#/application/mapper/CallSocketMapper";
import { Trace } from "#/presentation/utils/traces-decorator";
import {
  ILogger,
  SocketEvents,
  zodParser,
  InitiateCallDTO,
  InitiateCallSchema,
  AcceptCallDTO,
  AcceptCallSchema,
  RejectCallDTO,
  RejectCallSchema,
  HandleCallTimeoutDTO,
  HandleCallTimeoutSchema,
  EndCallDTO,
  EndCallSchema,
  RelayCallSignalDTO,
  RelayCallSignalSchema,
  ApplicationError,
} from "@sharemyride/shared";
import { Socket } from "socket.io";

export class CallSocketHandler implements ICallSocketHandler {
  constructor(
    readonly nameSpace: string,
    private readonly _logger: ILogger,
    private readonly _initiateCallUseCase: IInitiateCallUseCase,
    private readonly _acceptCallUseCase: IAcceptCallUseCase,
    private readonly _rejectCallUseCase: IRejectCallUseCase,
    private readonly _handleCallTimeoutUseCase: IHandleCallTimeoutUseCase,
    private readonly _endCallUseCase: IEndCallUseCase,
    private readonly _relayCallSignalUseCase: IRelayCallSignalUseCase,
  ) {}

  async register(socket: Socket): Promise<void> {
    socket.on(SocketEvents.CALL_INITIATED, (payload: unknown) =>
      this.onInitiateCall(socket, payload),
    );

    socket.on(SocketEvents.CALL_ACCEPTED, (payload: unknown) =>
      this.onAcceptCall(socket, payload),
    );

    socket.on(SocketEvents.CALL_REJECTED, (payload: unknown) =>
      this.onRejectCall(socket, payload),
    );

    socket.on(SocketEvents.CALL_NO_ANSWER, (payload: unknown) =>
      this.onCallTimeout(socket, payload),
    );

    socket.on(SocketEvents.CALL_ENDED, (payload: unknown) =>
      this.onEndCall(socket, payload),
    );

    socket.on(SocketEvents.CALL_SIGNAL, (payload: unknown) =>
      this.onRelaySignal(socket, payload),
    );

    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  @Trace("call-socket-handler")
  async onInitiateCall(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<InitiateCallDTO>(
        InitiateCallSchema,
        payload,
      );

      const dto = CallSocketMapper.toInitiateCallRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._initiateCallUseCase.execute(dto);
    } catch (error) {
      this._logger.error("CallSocketHandler.onInitiateCall error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("call-socket-handler")
  async onAcceptCall(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<AcceptCallDTO>(AcceptCallSchema, payload);

      const dto = CallSocketMapper.toAcceptCallRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._acceptCallUseCase.execute(dto);
    } catch (error) {
      this._logger.error("CallSocketHandler.onAcceptCall error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("call-socket-handler")
  async onRejectCall(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<RejectCallDTO>(RejectCallSchema, payload);

      const dto = CallSocketMapper.toRejectCallRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._rejectCallUseCase.execute(dto);
    } catch (error) {
      this._logger.error("CallSocketHandler.onRejectCall error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("call-socket-handler")
  async onCallTimeout(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<HandleCallTimeoutDTO>(
        HandleCallTimeoutSchema,
        payload,
      );

      const dto = CallSocketMapper.toHandleCallTimeoutRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._handleCallTimeoutUseCase.execute(dto);
    } catch (error) {
      this._logger.error("CallSocketHandler.onCallTimeout error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("call-socket-handler")
  async onEndCall(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<EndCallDTO>(EndCallSchema, payload);

      const dto = CallSocketMapper.toEndCallRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._endCallUseCase.execute(dto);
    } catch (error) {
      this._logger.error("CallSocketHandler.onEndCall error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("call-socket-handler")
  async onRelaySignal(socket: Socket, payload: unknown): Promise<void> {
    try {
      const validated = zodParser<RelayCallSignalDTO>(
        RelayCallSignalSchema,
        payload,
      );

      const dto = CallSocketMapper.toRelayCallSignalRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._relayCallSignalUseCase.execute(dto);
    } catch (error) {
      this._logger.error("CallSocketHandler.onRelaySignal error", { error });
      this.emitError(socket, error);
      throw error;
    }
  }

  @Trace("call-socket-handler")
  async onDisconnect(socket: Socket): Promise<void> {
    this._logger.info("Call socket disconnected", { socketId: socket.id });
  }

  private emitError(socket: Socket, error: unknown): void {
    const message =
      error instanceof ApplicationError
        ? error.message
        : "An unexpected error occurred";

    socket.emit(SocketEvents.CALL_ERROR, { message });
  }
}

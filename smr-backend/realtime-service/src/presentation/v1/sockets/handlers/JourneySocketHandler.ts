import { IDriverJoinJourneyUseCase } from "#/application/interfaces/use-cases/journey/IDriverJoinJourneyUseCase";
import { IPassengerJoinJourneyUseCase } from "#/application/interfaces/use-cases/journey/IPassengerJoinJourneyUseCase";
import { IShareTokenJoinJourneyUseCase } from "#/application/interfaces/use-cases/journey/IShareTokenJoinJourneyUseCase";
import { IUpdateLocationUseCase } from "#/application/interfaces/use-cases/journey/IUpdateLocationUseCase";
import { ILeaveJourneyUseCase } from "#/application/interfaces/use-cases/journey/ILeaveJouneyUseCase";
import { IJourneySocketHandler } from "#/presentation/v1/sockets/interfaces/IJourneySocketHandler";
import { JourneySocketMapper } from "#/application/mapper/JourneySocketMapper";
import { Trace } from "#/presentation/utils/traces-decorator";
import {
  ILogger,
  SocketEvents,
  zodParser,
  DriverJoinJourneyDTO,
  PassengerJoinJourneyDTO,
  ShareTokenJoinJourneyDTO,
  UpdateLocationDTO,
  LeaveJourneyDTO,
  DriverJoinJourneySchema,
  PassengerJoinJourneySchema,
  ShareTokenJoinJourneySchema,
  UpdateLocationSchema,
  LeaveJourneySchema,
  ApplicationError,
} from "@sharemyride/shared";
import { Socket } from "socket.io";

export class JourneySocketHandler implements IJourneySocketHandler {
  constructor(
    readonly nameSpace: string,
    private readonly _logger: ILogger,
    private readonly _driverJoinJourneyUseCase: IDriverJoinJourneyUseCase,
    private readonly _passengerJoinJourneyUseCase: IPassengerJoinJourneyUseCase,
    private readonly _shareTokenJoinJourneyUseCase: IShareTokenJoinJourneyUseCase,
    private readonly _updateLocationUseCase: IUpdateLocationUseCase,
    private readonly _leaveJourneyUseCase: ILeaveJourneyUseCase,
  ) {}

  async register(socket: Socket): Promise<void> {
    this._logger.info("Registering journey socket handlers", { socketId: socket.id });

    socket.on(SocketEvents.JOURNEY_DRIVER_JOIN, (payload: unknown) =>
      this.onDriverJoin(socket, payload),
    );

    socket.on(SocketEvents.JOURNEY_PASSENGER_JOIN, (payload: unknown) =>
      this.onPassengerJoin(socket, payload),
    );

    socket.on(SocketEvents.JOURNEY_SHARE_TOKEN_JOIN, (payload: unknown) =>
      this.onShareTokenJoin(socket, payload),
    );

    socket.on(SocketEvents.JOURNEY_LOCATION_UPDATE, (payload: unknown) =>
      this.onLocationUpdate(socket, payload),
    );

    socket.on(SocketEvents.JOURNEY_LEAVE, (payload: unknown) =>
      this.onLeave(socket, payload),
    );

    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  @Trace("journey-socket-handler")
  async onDriverJoin(socket: Socket, payload: unknown): Promise<void> {
    this._logger.info("JourneySocketHandler.onDriverJoin", { socketId: socket.id });
    try {
      const validated = zodParser<DriverJoinJourneyDTO>(
        DriverJoinJourneySchema,
        payload,
      );

      const dto = JourneySocketMapper.toDriverJoinJourneyRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._driverJoinJourneyUseCase.execute(dto, socket.id);
    } catch (error) {
      this._logger.error("JourneySocketHandler.onDriverJoin error", { error });
      this.emitError(socket, error);
    }
  }

  @Trace("journey-socket-handler")
  async onPassengerJoin(socket: Socket, payload: unknown): Promise<void> {
    this._logger.info("JourneySocketHandler.onPassengerJoin", { socketId: socket.id });
    try {
      const validated = zodParser<PassengerJoinJourneyDTO>(
        PassengerJoinJourneySchema,
        payload,
      );

      const dto = JourneySocketMapper.toPassengerJoinJourneyRequestDTO(
        validated,
        socket.data.userId as string,
      );

      await this._passengerJoinJourneyUseCase.execute(dto, socket.id);
    } catch (error) {
      this._logger.error("JourneySocketHandler.onPassengerJoin error", {
        error,
      });
      this.emitError(socket, error);
    }
  }

  @Trace("journey-socket-handler")
  async onShareTokenJoin(socket: Socket, payload: unknown): Promise<void> {
    this._logger.info("JourneySocketHandler.onShareTokenJoin", { socketId: socket.id });
    try {
      const validated = zodParser<ShareTokenJoinJourneyDTO>(
        ShareTokenJoinJourneySchema,
        payload,
      );

      const dto =
        JourneySocketMapper.toShareTokenJoinJourneyRequestDTO(validated);

      await this._shareTokenJoinJourneyUseCase.execute(dto, socket.id);
    } catch (error) {
      this._logger.error("JourneySocketHandler.onShareTokenJoin error", {
        error,
      });
      this.emitError(socket, error);
    }
  }

  @Trace("journey-socket-handler")
  async onLocationUpdate(socket: Socket, payload: unknown): Promise<void> {
    this._logger.info("JourneySocketHandler.onLocationUpdate", { socketId: socket.id });
    try {
      const validated = zodParser<UpdateLocationDTO>(
        UpdateLocationSchema,
        payload,
      );

      const dto = JourneySocketMapper.toUpdateLocationRequestDTO(validated);

      await this._updateLocationUseCase.execute(dto);
    } catch (error) {
      this._logger.error("JourneySocketHandler.onLocationUpdate error", {
        error,
      });
      this.emitError(socket, error);
    }
  }

  @Trace("journey-socket-handler")
  async onLeave(socket: Socket, payload: unknown): Promise<void> {
    this._logger.info("JourneySocketHandler.onLeave", { socketId: socket.id });
    try {
      const validated = zodParser<LeaveJourneyDTO>(
        LeaveJourneySchema,
        payload,
      );

      const dto = JourneySocketMapper.toLeaveJourneyRequestDTO(validated);

      await this._leaveJourneyUseCase.execute(dto, socket.id);
    } catch (error) {
      this._logger.error("JourneySocketHandler.onLeave error", { error });
      this.emitError(socket, error);
    }
  }

  @Trace("journey-socket-handler")
  async onDisconnect(socket: Socket): Promise<void> {
    this._logger.info("Journey socket disconnected", {
      socketId: socket.id,
    });
  }

  private emitError(socket: Socket, error: unknown): void {
    const message =
      error instanceof ApplicationError
        ? error.message
        : "An unexpected error occurred";

    socket.emit(SocketEvents.JOURNEY_ERROR, { message });
  }
}

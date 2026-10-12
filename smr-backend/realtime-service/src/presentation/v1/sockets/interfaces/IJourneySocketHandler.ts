import { Socket } from "socket.io";
import { ISocketHandler } from "#/presentation/v1/sockets/interfaces/ISocketHandler";

export interface IJourneySocketHandler extends ISocketHandler {
  onDriverJoin(socket: Socket, payload: unknown): Promise<void>;
  onPassengerJoin(socket: Socket, payload: unknown): Promise<void>;
  onShareTokenJoin(socket: Socket, payload: unknown): Promise<void>;
  onLocationUpdate(socket: Socket, payload: unknown): Promise<void>;
  onLeave(socket: Socket, payload: unknown): Promise<void>;
  onDisconnect(socket: Socket): Promise<void>;
}

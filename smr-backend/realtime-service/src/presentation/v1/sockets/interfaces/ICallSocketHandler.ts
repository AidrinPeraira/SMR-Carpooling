import { Socket } from "socket.io";
import { ISocketHandler } from "#/presentation/v1/sockets/interfaces/ISocketHandler";

export interface ICallSocketHandler extends ISocketHandler {
  onInitiateCall(socket: Socket, payload: unknown): Promise<void>;
  onAcceptCall(socket: Socket, payload: unknown): Promise<void>;
  onRejectCall(socket: Socket, payload: unknown): Promise<void>;
  onCallTimeout(socket: Socket, payload: unknown): Promise<void>;
  onEndCall(socket: Socket, payload: unknown): Promise<void>;
  onRelaySignal(socket: Socket, payload: unknown): Promise<void>;
  onDisconnect(socket: Socket): Promise<void>;
}

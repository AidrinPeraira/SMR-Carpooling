import { Socket } from "socket.io";
import { ISocketHandler } from "#/presentation/v1/sockets/interfaces/ISocketHandler";

export interface IChatSocketHandler extends ISocketHandler {
  onJoinChat(socket: Socket, payload: unknown): Promise<void>;
  onLeaveChat(socket: Socket, payload: unknown): Promise<void>;
  onSendMessage(socket: Socket, payload: unknown): Promise<void>;
  onDisconnect(socket: Socket): Promise<void>;
}

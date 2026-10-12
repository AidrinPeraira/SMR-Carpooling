import { SocketEvents } from "@sharemyride/shared";

/**
 * This interface defines a emitter class for socket connections
 * It defines the methods needed by the use cases to emit socket
 * events irrespective of the payload
 */
export interface ISocketEmitter {
  joinRoom(roomId: string, socketId: string): Promise<void>;
  leaveRoom(roomId: string, socketId: string): Promise<void>;
  emitToRoom(roomId: string, event: SocketEvents, data: unknown): Promise<void>;
  isUserConnected(userId: string): Promise<boolean>;
}

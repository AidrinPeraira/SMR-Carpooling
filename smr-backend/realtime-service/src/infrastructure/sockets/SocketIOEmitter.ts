import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { SocketEvents } from "@sharemyride/shared";
import { Server } from "socket.io";

export class SocketIOEmitter implements ISocketEmitter {
  constructor(
    private readonly _socketServer: Server,
    private readonly _nameSpace: string,
  ) {}

  async joinRoom(roomId: string, socketId: string): Promise<void> {
    const socket = this._socketServer.of(this._nameSpace).sockets.get(socketId);
    if (socket) {
      socket.join(roomId);
    }
  }

  async leaveRoom(roomId: string, socketId: string): Promise<void> {
    const socket = this._socketServer.of(this._nameSpace).sockets.get(socketId);
    if (socket) {
      socket.leave(roomId);
    }
  }

  async emitToRoom(
    roomId: string,
    event: SocketEvents,
    data: unknown,
  ): Promise<void> {
    this._socketServer.of(this._nameSpace).to(roomId).emit(`${event}`, data);
  }
}

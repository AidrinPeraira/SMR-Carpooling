import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { ILogger, SocketEvents } from "@sharemyride/shared";
import { Server } from "socket.io";

export class SocketIOEmitter implements ISocketEmitter {
  constructor(
    private readonly _socketServer: Server,
    private readonly _nameSpace: string,
    private readonly _logger: ILogger,
  ) {}

  async joinRoom(roomId: string, socketId: string): Promise<void> {
    const socket = this._socketServer.of(this._nameSpace).sockets.get(socketId);
    if (!socket) {
      this._logger.warn("joinRoom: socket not found in namespace", {
        roomId,
        socketId,
        namespace: this._nameSpace,
      });
      return;
    }
    await socket.join(roomId);
  }

  async leaveRoom(roomId: string, socketId: string): Promise<void> {
    const socket = this._socketServer.of(this._nameSpace).sockets.get(socketId);
    if (!socket) {
      this._logger.warn("leaveRoom: socket not found in namespace — room leave did not execute", {
        roomId,
        socketId,
        namespace: this._nameSpace,
      });
      return;
    }
    await socket.leave(roomId);
    this._logger.info("leaveRoom: socket removed from room", {
      roomId,
      socketId,
      namespace: this._nameSpace,
    });
  }

  async emitToRoom(
    roomId: string,
    event: SocketEvents,
    data: unknown,
  ): Promise<void> {
    this._socketServer.of(this._nameSpace).to(roomId).emit(`${event}`, data);
  }

  async isUserConnected(userId: string): Promise<boolean> {
    const roomId = `user:${userId}`;
    const sockets = await this._socketServer
      .of(this._nameSpace)
      .in(roomId)
      .fetchSockets();

    return sockets.length > 0;
  }
}

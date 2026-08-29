import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";
import { Server, Socket } from "socket.io";

export class SocketIOGateway implements ISocketGateway {
  private userSockets: Map<string, Set<string>> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  registerSocket(userId: string, socket: Socket) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);
  }

  removeSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  async emitToChat(chatId: string, event: string, payload: any): Promise<void> {
    this.io.to(`chat_${chatId}`).emit(event, payload);
  }

  async emitToUser(userId: string, event: string, payload: any): Promise<void> {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const socketId of sockets) {
        this.io.to(socketId).emit(event, payload);
      }
    }
  }

  async isUserConnected(userId: string): Promise<boolean> {
    const sockets = this.userSockets.get(userId);
    return !!sockets && sockets.size > 0;
  }

  async joinRoom(userId: string, room: string): Promise<void> {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const socketId of sockets) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) void socket.join(room);
      }
    }
  }

  async leaveRoom(userId: string, room: string): Promise<void> {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const socketId of sockets) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) void socket.leave(room);
      }
    }
  }
}

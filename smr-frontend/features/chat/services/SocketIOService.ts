import { io, Socket } from "socket.io-client";
import { ChatMessageDTO } from "@sharemyride/shared";
import { ISocketService } from "./ISocketService";

export class SocketIOService implements ISocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(userId: string): void {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      auth: { userId },
      transports: ["websocket", "polling"],
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(chatId: string): void {
    if (this.socket) {
      this.socket.emit("join_chat", { chatId });
    }
  }

  sendMessage(chatId: string, body: string): void {
    if (this.socket) {
      this.socket.emit("send_message", { chatId, body });
    }
  }

  syncHistory(chatId: string): void {
    if (this.socket) {
      this.socket.emit("sync_history", { chatId });
    }
  }

  onHistory(callback: (messages: ChatMessageDTO[]) => void): void {
    if (this.socket) {
      this.socket.on("chat_history", callback);
    }
  }

  onMessage(callback: (message: ChatMessageDTO) => void): void {
    if (this.socket) {
      this.socket.on("new_message", callback);
    }
  }

  offHistory(callback: (messages: ChatMessageDTO[]) => void): void {
    if (this.socket) {
      this.socket.off("chat_history", callback);
    }
  }

  offMessage(callback: (message: ChatMessageDTO) => void): void {
    if (this.socket) {
      this.socket.off("new_message", callback);
    }
  }
}

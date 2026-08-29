export interface ISocketGateway {
  emitToChat(chatId: string, event: string, payload: any): Promise<void>;
  emitToUser(userId: string, event: string, payload: any): Promise<void>;
  isUserConnected(userId: string): Promise<boolean>;
  joinRoom(userId: string, room: string): Promise<void>;
  leaveRoom(userId: string, room: string): Promise<void>;
}

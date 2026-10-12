import { LeaveTripChatRequestDTO } from "#/application/dto/ChatDTO";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { ILeaveTripChatUseCase } from "#/application/interfaces/use-cases/chat-message/ILeaveTripChatUseCase";

/**
 * This class impleemtns the use case that disconnects a user
 * from a trip chat room
 */
export class LeaveTripChatUseCase implements ILeaveTripChatUseCase {
  constructor(private readonly _socketEmitter: ISocketEmitter) {}

  async execute(dto: LeaveTripChatRequestDTO, socketId: string): Promise<void> {
    await this._socketEmitter.leaveRoom(dto.chatId, socketId);
  }
}

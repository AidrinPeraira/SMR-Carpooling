import { IHandleUserConnectUseCase } from "#/application/interfaces/use-cases/chat-messaging/IHandleUserConnectUseCase";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { IChatRepository } from "#/application/interfaces/repository/IChatRepository";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";

export class HandleUserConnectUseCase implements IHandleUserConnectUseCase {
  constructor(
    private memberRepo: IMemberRepository,
    private chatRepo: IChatRepository,
    private socketGateway: ISocketGateway
  ) {}

  async execute(userId: string): Promise<void> {
    const member = await this.memberRepo.findByCustomId(userId);
    if (!member) return;

    for (const tripId of member.activeTrips) {
      // Find active chat for trip
      const chats = await this.chatRepo.find({ filterField: "tripId", filterValue: tripId, limit: 1, page: 1 });
      if (chats.data.length > 0 && chats.data[0]?.isActive) {
        await this.socketGateway.joinRoom(userId, `chat_${chats.data[0]?.chatId}`);
      }
    }
  }
}

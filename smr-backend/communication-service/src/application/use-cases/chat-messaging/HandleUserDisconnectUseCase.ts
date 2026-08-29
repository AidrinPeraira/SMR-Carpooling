import { IHandleUserDisconnectUseCase } from "#/application/interfaces/use-cases/chat-messaging/IHandleUserDisconnectUseCase";
import { ISocketGateway } from "#/application/interfaces/services/ISocketGateway";

export class HandleUserDisconnectUseCase implements IHandleUserDisconnectUseCase {
  constructor(
    private socketGateway: ISocketGateway
  ) {}

  async execute(_userId: string): Promise<void> {
    // Handle any logic when user disconnects. Socket gateway already cleans up sockets.
    // If we need to update "last seen" or offline status, it would go here.
    return Promise.resolve();
  }
}

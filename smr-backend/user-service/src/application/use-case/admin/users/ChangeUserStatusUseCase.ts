import { ChangeUserStatusRequestDTO } from "#/application/dto/admin/users/AdminUsersDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { ISessionStore } from "#/application/interfaces/store/ISessionStore";
import { IChangeUserStatusUseCase } from "#/application/interfaces/use-case/admin/users/IChangeUserStatusUseCase";
import {
  AccountStatus,
  EventName,
  UserBlockedEvent,
  UserUnblockedEvent,
} from "@sharemyride/shared";

export class ChangeUserStatusUseCase implements IChangeUserStatusUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _sessionStore: ISessionStore,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * Updates the user status.
   * If user is blocked, adds to blacklist session repository and publishes ADMIN_USER_BLOCKED event.
   * If user is unblocked, removes from blacklist and publishes ADMIN_USER_UNBLOCKED event.
   *
   * @param data : userId and new status of user
   */
  async execute(data: ChangeUserStatusRequestDTO): Promise<void> {
    const updatedUser = await this._userRepository.updateByCustomId(
      data.userId,
      {
        accountStatus: data.status,
      },
    );

    if (data.status === AccountStatus.BLOCKED) {
      const event: UserBlockedEvent = {
        eventName: EventName.ADMIN_USER_BLOCKED,
        timestamp: new Date(),
        payload: {
          userId: updatedUser.userId,
          isDriver: Boolean(updatedUser.isDriver),
          status: AccountStatus.BLOCKED,
        },
      };

      await this._eventBus.publish(event);
      await this._sessionStore.addToSessionBlacklist(updatedUser.userId);
    }

    if (data.status === AccountStatus.ACTIVE) {
      const event: UserUnblockedEvent = {
        eventName: EventName.ADMIN_USER_UNBLOCKED,
        timestamp: new Date(),
        payload: {
          userId: updatedUser.userId,
          isDriver: Boolean(updatedUser.isDriver),
          status: AccountStatus.ACTIVE,
        },
      };

      await this._eventBus.publish(event);
      await this._sessionStore.removeFromSessionBlacklist(updatedUser.userId);
    }
  }
}

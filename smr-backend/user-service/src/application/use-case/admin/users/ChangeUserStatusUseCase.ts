import { ChangeUserStatusRequestDTO } from "#/application/dto/admin/users/AdminUsersDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { ISessionStore } from "#/application/interfaces/store/ISessionStore";
// import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
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
   * THis method takes the change user dto
   * updates the user status
   * if user is blocked it adds the user to the blacklist in session repository
   * it also publishes an event for any related services
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

    if (data.status == AccountStatus.BLOCKED) {
      //create event for other services
      const event: UserBlockedEvent = {
        eventName: EventName.ADMIN_USER_BLOCKED,
        timestamp: new Date(),
        payload: {
          userId: updatedUser.userId,
          status: AccountStatus.BLOCKED,
        },
      };

      await this._eventBus.publish(event);

      // Add to session store blacklist
      await this._sessionStore.addToSessionBlacklist(updatedUser.userId);
    }

    if (data.status == AccountStatus.ACTIVE) {
      //create event to remove from blocked status
      const event: UserUnblockedEvent = {
        eventName: EventName.ADMIN_USER_UNBLOCKED,
        timestamp: new Date(),
        payload: {
          userId: updatedUser.userId,
          status: AccountStatus.BLOCKED,
        },
      };

      await this._eventBus.publish(event);

      // Remove from session store blacklist
      await this._sessionStore.removeFromSessionBlacklist(updatedUser.userId);
    }
  }
}

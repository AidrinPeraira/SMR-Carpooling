import { ChangeUserStatusRequestDTO } from "#/application/dto/admin/users/AdminUsersDTO";
// import { ISessionRepository } from "#/application/interfaces/repository/ISessionRepository";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
// import { IEventBus } from "#/application/interfaces/services/IEventBus";
import { IChangeUserStatusUseCase } from "#/application/interfaces/use-case/admin/users/IChangeUserStatusUseCase";
import { AccountStatus } from "@smr/shared";

export class ChangeUserStatusUseCase implements IChangeUserStatusUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    // private readonly _sessionRespository: ISessionRepository,
    // private readonly _eventBus: IEventBus,
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

    //remove this line after implenting the blacklist and event condition
    console.log("Blocked user", updatedUser);

    if (data.status == AccountStatus.BLOCKED) {
      //create blacklist in session repository
      //create event for other services
    }

    if (data.status == AccountStatus.ACTIVE) {
      //create event to remove from blocked status
      //clear session repo blacklist from user
    }
  }
}

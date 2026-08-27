import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IChangeDriverStatusUseCase } from "#/application/interfaces/use-case/driver/IChangeDriverStatusUseCase";
import { IUnblockPassengerUseCase } from "#/application/interfaces/use-case/passenger/IUnblockPassengerUseCase";
import {
  DriverStatus,
  ILogger,
  UserUnblockedEvent,
} from "@sharemyride/shared";

export class UserUnblockedEventHandler implements IEventHandler<UserUnblockedEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _changeDriverStatusUseCase: IChangeDriverStatusUseCase,
    private readonly _unblockPassengerUseCase: IUnblockPassengerUseCase,
  ) {}

  async handle(event: UserUnblockedEvent): Promise<void> {
    const { userId, isDriver } = event.payload;

    this._logger.info(`Processing ADMIN_USER_UNBLOCKED event for passenger ${userId}`);
    await this._unblockPassengerUseCase.execute({ passengerId: userId });

    if (isDriver) {
      this._logger.info(`Processing ADMIN_USER_UNBLOCKED event for driver ${userId}`);
      await this._changeDriverStatusUseCase.execute({
        driverId: userId,
        driverStatus: DriverStatus.ACTIVE,
      });
    }
  }
}

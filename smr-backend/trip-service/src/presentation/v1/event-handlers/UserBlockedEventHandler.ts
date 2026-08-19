import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IChangeDriverStatusUseCase } from "#/application/interfaces/use-case/driver/IChangeDriverStatusUseCase";
import { IBlockPassengerUseCase } from "#/application/interfaces/use-case/passenger/IBlockPassengerUseCase";
import {
  DriverStatus,
  ILogger,
  UserBlockedEvent,
} from "@sharemyride/shared";

export class UserBlockedEventHandler implements IEventHandler<UserBlockedEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _changeDriverStatusUseCase: IChangeDriverStatusUseCase,
    private readonly _blockPassengerUseCase: IBlockPassengerUseCase,
  ) {}

  async handle(event: UserBlockedEvent): Promise<void> {
    const { userId, isDriver } = event.payload;

    this._logger.info(`Processing ADMIN_USER_BLOCKED event for passenger ${userId}`);
    await this._blockPassengerUseCase.execute({ passengerId: userId });

    if (isDriver) {
      this._logger.info(`Processing ADMIN_USER_BLOCKED event for driver ${userId}`);
      await this._changeDriverStatusUseCase.execute({
        driverId: userId,
        driverStatus: DriverStatus.BLOCKED,
      });
    }
  }
}

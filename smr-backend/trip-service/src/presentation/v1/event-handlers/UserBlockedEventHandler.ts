import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IChangeDriverStatusUseCase } from "#/application/interfaces/use-case/driver/IChangeDriverStatusUseCase";
import {
  DriverStatus,
  ILogger,
  UserBlockedEvent,
} from "@sharemyride/shared";

export class UserBlockedEventHandler implements IEventHandler<UserBlockedEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _changeDriverStatusUseCase: IChangeDriverStatusUseCase,
  ) {}

  async handle(event: UserBlockedEvent): Promise<void> {
    const { userId, isDriver } = event.payload;

    if (!isDriver) {
      this._logger.info(`User ${userId} is not a driver. Dropping ADMIN_USER_BLOCKED event.`);
      return;
    }

    this._logger.info(`Processing ADMIN_USER_BLOCKED event for driver ${userId}`);

    await this._changeDriverStatusUseCase.execute({
      driverId: userId,
      driverStatus: DriverStatus.BLOCKED,
    });
  }
}

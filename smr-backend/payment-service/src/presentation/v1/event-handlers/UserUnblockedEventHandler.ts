import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IUnblockCustomerUseCase } from "#/application/interfaces/use-cases/customer/IUnblockCustomerUseCase";
import { ILogger, UserUnblockedEvent } from "@sharemyride/shared";

export class UserUnblockedEventHandler implements IEventHandler<UserUnblockedEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _unblockCustomerUseCase: IUnblockCustomerUseCase,
  ) {}

  async handle(event: UserUnblockedEvent): Promise<void> {
    const { userId } = event.payload;
    this._logger.info(`Processing ADMIN_USER_UNBLOCKED event for customer ${userId}`);

    await this._unblockCustomerUseCase.execute(userId);
  }
}

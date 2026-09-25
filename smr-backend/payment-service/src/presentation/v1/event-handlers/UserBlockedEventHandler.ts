import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IBlockCustomerUseCase } from "#/application/interfaces/use-cases/customer/IBlockCustomerUseCase";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";
import { ILogger, UserBlockedEvent } from "@sharemyride/shared";

export class UserBlockedEventHandler implements IEventHandler<UserBlockedEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _blockCustomerUseCase: IBlockCustomerUseCase,
  ) {}

  @Trace("payment-service-event-handler")
  async handle(event: UserBlockedEvent): Promise<void> {
    const { userId } = event.payload;
    this._logger.info(
      `Processing ADMIN_USER_BLOCKED event for customer ${userId}`,
    );

    await this._blockCustomerUseCase.execute(userId);
  }
}

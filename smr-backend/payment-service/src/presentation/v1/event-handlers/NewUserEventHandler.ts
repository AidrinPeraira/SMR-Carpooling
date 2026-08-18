import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { INewCustomerUseCase } from "#/application/interfaces/use-cases/customer/INewCustomerUseCase";
import { ILogger, UserSignUpEvent } from "@sharemyride/shared";

export class NewUserEventHandler implements IEventHandler<UserSignUpEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _newCustomerUseCase: INewCustomerUseCase,
  ) {}

  async handle(event: UserSignUpEvent): Promise<void> {
    this._logger.info("Handling new user event for payment service: ", event.payload.userId);

    await this._newCustomerUseCase.execute({
      customerId: event.payload.userId,
      firstName: event.payload.firstName,
      lastName: event.payload.lastName,
      emailId: event.payload.emailId,
    });
  }
}

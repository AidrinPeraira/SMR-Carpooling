import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ICreateNewPassengerUseCase } from "#/application/interfaces/use-case/passenger/ICreateNewPassengerUseCase";
import { ILogger, UserSignUpEvent } from "@sharemyride/shared";

export class NewUserEventHandler implements IEventHandler<UserSignUpEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly createNewPassengerUseCase: ICreateNewPassengerUseCase,
  ) {}

  async handle(event: UserSignUpEvent): Promise<void> {
    this._logger.info("Handling new user event: ", event.payload.userId);

    await this.createNewPassengerUseCase.execute({
      userId: event.payload.userId,
      firstName: event.payload.firstName,
      lastName: event.payload.lastName,
      emailId: event.payload.emailId,
    });
  }
}

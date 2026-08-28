import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, UserSignUpEvent } from "@sharemyride/shared";
import { ICreateMemberUseCase } from "#/application/interfaces/use-cases/ICreateMemberUseCase";

/**
 * This class implemnts the event handler that
 * handles user signup events to create a new
 * memeber for communication using create member
 * use  case
 */
export class UserSignupEventHandler implements IEventHandler<UserSignUpEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _createMemberUseCase: ICreateMemberUseCase,
  ) {}

  async handle(event: UserSignUpEvent): Promise<void> {
    try {
      this._logger.info("Handling user signup event in communication service", {
        userId: event.payload.userId,
      });

      await this._createMemberUseCase.execute({
        firstName: event.payload.firstName,
        lastName: event.payload.lastName,
        userId: event.payload.userId,
      });

      this._logger.info("Successfully created member from signup event");
    } catch (error: unknown) {
      this._logger.error("Failed to handle user signup event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

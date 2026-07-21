import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendSignupVerificationMailUseCase } from "#/application/interfaces/use-case/ISendSignupVerificationMailUseCase";
import { ILogger, UserSignUpEvent } from "@sharemyride/shared";

export class UserSignupHandler implements IEventHandler<UserSignUpEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendSignupVerificationMailUseCase: ISendSignupVerificationMailUseCase,
  ) {}

  /**
   * This method maps the event data/payload into DTO
   * Passes the dto and calls the use case
   */
  async handle(event: UserSignUpEvent): Promise<void> {
    const signupVerificationMailDTO: SinupVerifcationMailRequestDTO = {
      userName: event.payload.firstName + " " + event.payload.lastName,
      emailId: event.payload.emailId,
      userId: event.payload.userId,
      verificationToken: event.payload.token,
    };

    this._logger.info("Sending signup verification mail: ", {
      emailId: event.payload.emailId,
    });
    await this._sendSignupVerificationMailUseCase.execute(
      signupVerificationMailDTO,
    );
  }
}

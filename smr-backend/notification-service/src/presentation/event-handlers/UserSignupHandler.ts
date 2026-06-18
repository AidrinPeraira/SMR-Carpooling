import { SinupVerifcationMailRequestDTO } from "#/application/dto/email/SignupVerificationMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendSignupVerificationMailUseCase } from "#/application/interfaces/use-case/ISendSignupVerificationMailUseCase";
import { UserSignUpEvent } from "@smr/shared";

export class UserSignupHandler implements IEventHandler<UserSignUpEvent> {
  constructor(
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

    await this._sendSignupVerificationMailUseCase.execute(
      signupVerificationMailDTO,
    );
  }
}

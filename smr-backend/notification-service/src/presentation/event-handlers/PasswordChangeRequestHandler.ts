import { PasswordChangeRequestMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendPasswordChangeRequestMailUseCase } from "#/application/interfaces/use-case/ISendPasswordChangeRequestMailUseCase";
import { ILogger, PasswordChangeRequestEvent } from "@smr/shared";

export class PasswordChangeRequestHandler implements IEventHandler<PasswordChangeRequestEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _useCase: ISendPasswordChangeRequestMailUseCase,
  ) {}

  async handle(event: PasswordChangeRequestEvent): Promise<void> {
    const dto: PasswordChangeRequestMailDTO = {
      userName: event.payload.firstName + " " + event.payload.lastName,
      emailId: event.payload.emailId,
      userId: event.payload.userId,
      token: event.payload.token,
    };

    this._logger.info("Handling event password change request", {
      emailId: dto.emailId,
    });
    await this._useCase.execute(dto);
  }
}

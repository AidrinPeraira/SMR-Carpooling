import { PasswordChangedMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendPasswordChangedMailUseCase } from "#/application/interfaces/use-case/ISendPasswordChangedMailUseCase";
import { ILogger, PasswordChangedEvent } from "@smr/shared";

export class PasswordChangedHandler implements IEventHandler<PasswordChangedEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _useCase: ISendPasswordChangedMailUseCase,
  ) {}

  async handle(event: PasswordChangedEvent): Promise<void> {
    const dto: PasswordChangedMailDTO = {
      userName: event.payload.firstName + " " + event.payload.lastName,
      emailId: event.payload.emailId,
      userId: event.payload.userId,
    };

    this._logger.info("Sending password change notification mail:  ", {
      emailId: dto.emailId,
    });
    await this._useCase.execute(dto);
  }
}

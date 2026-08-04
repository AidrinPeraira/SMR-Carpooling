import { ApplicationReturnedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendApplicationReturnedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationReturnedMailUseCase";
import { ApplicationReturnEvent, ILogger } from "@sharemyride/shared";

export class ApplicationReturnedHandler
  implements IEventHandler<ApplicationReturnEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendApplicationReturnedMailUseCase: ISendApplicationReturnedMailUseCase,
  ) {}

  async handle(event: ApplicationReturnEvent): Promise<void> {
    const dto: ApplicationReturnedMailDTO = {
      userName: `${event.payload.firstName} ${event.payload.lastName}`,
      emailId: event.payload.emailId,
      applicationType: event.payload.applicationType,
      comment: event.payload.comment,
    };

    this._logger.info("Sending application returned email notification: ", {
      emailId: event.payload.emailId,
      applicationId: event.payload.applicationId,
    });

    await this._sendApplicationReturnedMailUseCase.execute(dto);
  }
}

import { ApplicationRejectedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendApplicationRejectedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationRejectedMailUseCase";
import { ApplicationRejectEvent, ILogger } from "@sharemyride/shared";

export class ApplicationRejectedHandler
  implements IEventHandler<ApplicationRejectEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendApplicationRejectedMailUseCase: ISendApplicationRejectedMailUseCase,
  ) {}

  async handle(event: ApplicationRejectEvent): Promise<void> {
    const dto: ApplicationRejectedMailDTO = {
      userName: `${event.payload.firstName} ${event.payload.lastName}`,
      emailId: event.payload.emailId,
      applicationType: event.payload.applicationType,
      comment: event.payload.comment,
    };

    this._logger.info("Sending application rejected email notification: ", {
      emailId: event.payload.emailId,
      applicationId: event.payload.applicationId,
    });

    await this._sendApplicationRejectedMailUseCase.execute(dto);
  }
}

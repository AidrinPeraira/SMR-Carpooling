import { ApplicationApprovedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendApplicationApprovedMailUseCase } from "#/application/interfaces/use-case/ISendApplicationApprovedMailUseCase";
import { ApplicationApprovedEvent, ILogger } from "@sharemyride/shared";

export class ApplicationApprovedHandler
  implements IEventHandler<ApplicationApprovedEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendApplicationApprovedMailUseCase: ISendApplicationApprovedMailUseCase,
  ) {}

  async handle(event: ApplicationApprovedEvent): Promise<void> {
    const dto: ApplicationApprovedMailDTO = {
      userName: `${event.payload.firstName} ${event.payload.lastName}`,
      emailId: event.payload.emailId,
      applicationType: event.payload.applicatoinType,
      comment: event.payload.comment,
    };

    this._logger.info("Sending application approved email notification: ", {
      emailId: event.payload.emailId,
      applicationId: event.payload.applicationId,
    });

    await this._sendApplicationApprovedMailUseCase.execute(dto);
  }
}

import { TripCancellationMailDTO } from "#/application/dto/email/TripCancellationMailDTO";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { ITripEmailTemplateFactory } from "#/application/interfaces/templates/ITripEmailTemplateFactory";
import { ISendTripCancellationEmailUseCase } from "#/application/interfaces/use-case/trip/ISendTripCancellationEmailUseCase";

export class SendTripCancellationEmailsUseCase implements ISendTripCancellationEmailUseCase {
  constructor(
    private readonly _mailService: IMailService,
    private readonly _templateFactory: ITripEmailTemplateFactory,
  ) {}

  async execute(data: TripCancellationMailDTO): Promise<void> {
    const notifications = this._templateFactory.createTripCancellationNotifications(data);
    await Promise.all(notifications.map((n) => this._mailService.send(n)));
  }
}

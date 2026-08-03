import { ApplicationReturnedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";

export interface ISendApplicationReturnedMailUseCase {
  execute(data: ApplicationReturnedMailDTO): Promise<void>;
}

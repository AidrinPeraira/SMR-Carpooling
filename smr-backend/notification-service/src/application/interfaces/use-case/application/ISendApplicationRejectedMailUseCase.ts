import { ApplicationRejectedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";

export interface ISendApplicationRejectedMailUseCase {
  execute(data: ApplicationRejectedMailDTO): Promise<void>;
}

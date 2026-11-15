import { ApplicationApprovedMailDTO } from "#/application/dto/email/ApplicationNotificationMailDTO";

export interface ISendApplicationApprovedMailUseCase {
  execute(data: ApplicationApprovedMailDTO): Promise<void>;
}

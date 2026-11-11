import { PasswordChangeRequestMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";

export interface ISendPasswordChangeRequestMailUseCase {
  execute(data: PasswordChangeRequestMailDTO): Promise<void>;
}

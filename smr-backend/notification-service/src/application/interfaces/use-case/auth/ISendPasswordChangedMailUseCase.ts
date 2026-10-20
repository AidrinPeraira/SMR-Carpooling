import { PasswordChangedMailDTO } from "#/application/dto/email/PasswordChangeMailDTO";

export interface ISendPasswordChangedMailUseCase {
  execute(data: PasswordChangedMailDTO): Promise<void>;
}

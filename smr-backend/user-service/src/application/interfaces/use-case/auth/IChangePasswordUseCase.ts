import { PasswordChangeRequestDTO } from "#/application/dto/auth/PasswordChangeDTO";

export interface IChangePasswordUseCase {
  execute(data: PasswordChangeRequestDTO): Promise<void>;
}

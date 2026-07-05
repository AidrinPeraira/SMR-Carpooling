import { GeneratePasswordChangeTokenRequestDTO } from "#/application/dto/auth/PasswordChangeDTO";

export interface IGeneratePasswordChangeTokenUseCase {
  execute(data: GeneratePasswordChangeTokenRequestDTO): Promise<void>;
}

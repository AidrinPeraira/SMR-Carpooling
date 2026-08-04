import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";

export interface ISwitchUserRoleUseCase {
  execute(userId: string): Promise<LoginUserResultDTO>;
}

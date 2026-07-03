import { RefreshTokenRequestDTO } from "#/application/dto/auth/RefreshTokenRequestDTO";
import { RefreshTokenResultDTO } from "#/application/dto/auth/RefreshTokenResultDTO";

export interface IRefreshTokenUseCase {
  execute(data: RefreshTokenRequestDTO): Promise<RefreshTokenResultDTO>;
}

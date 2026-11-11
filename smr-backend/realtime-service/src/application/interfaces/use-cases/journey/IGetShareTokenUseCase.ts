import {
  GetShareTokenRequestDTO,
  GetShareTokenResponseDTO,
} from "#/application/dto/JourneyDTO";

/**
 * This use case handles issuing a share token for passengers
 * to share their live locaiton data. It creates a new token
 * or shares the existing one.
 */
export interface IGetShareTokenUseCase {
  execute(dto: GetShareTokenRequestDTO): Promise<GetShareTokenResponseDTO>;
}

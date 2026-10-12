import { UpdateLocationRequestDTO } from "#/application/dto/JourneyDTO";

/**
 * This use case handles sharing live location updates
 * to all members subscribed to a room for a journey
 */
export interface IUpdateLocationUseCase {
  execute(dto: UpdateLocationRequestDTO): Promise<void>;
}

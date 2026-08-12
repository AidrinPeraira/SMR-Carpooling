import { CreateTripRequestDTO } from "#/application/dto/trip/CreateTripRequestDTO";

/**
 * This use case creates a new trip in trip repository
 * with new trip data
 */
export interface ICreateTripUseCase {
  execute(data: CreateTripRequestDTO): Promise<void>;
}

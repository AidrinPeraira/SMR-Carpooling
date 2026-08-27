import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { ICleanUpTripsIndexingUseCase } from "#/application/interfaces/use-case/trip/ICleanUpTripsIndexingUseCase";

export class CleanUpTripsIndexingUseCase implements ICleanUpTripsIndexingUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  /**
   * This method calls the repositrory to celan up indices of past trips
   */
  async execute(): Promise<void> {
    await this._tripRepository.cleanIndices();
  }
}

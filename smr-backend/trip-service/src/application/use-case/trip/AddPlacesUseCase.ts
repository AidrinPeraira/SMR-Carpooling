import { AddPlacesRequestDTO } from "#/application/dto/trip/AddPlacesRequestDTO";
import { IPlacesRepository } from "#/application/interfaces/repository/IPlacesRepository";
import { IAddPlacesUseCase } from "#/application/interfaces/use-case/trip/IAddPlacesUseCase";

/**
 * Implementation of the use case for adding predefined places to the places repository.
 */
export class AddPlacesUseCase implements IAddPlacesUseCase {
  /**
   * Constructs the AddPlacesUseCase.
   *
   * @param _placesRepository - Repository for places management
   */
  constructor(private readonly _placesRepository: IPlacesRepository) {}

  /**
   * Executes the use case to store a list of places.
   *
   * @param data - Array of place request DTOs
   */
  async execute(data: AddPlacesRequestDTO[]): Promise<void> {
    await this._placesRepository.addPlaces(data);
  }
}

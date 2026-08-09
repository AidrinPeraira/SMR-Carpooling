import { IPlacesRepository } from "#/application/interfaces/repository/IPlacesRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { PlacesEntity } from "#/domain/entities/PlacesEntity";
import { prisma } from "#/infrastructure/database/prisma";

/**
 * Repository implementation for managing predefined places in the database.
 */
export class PlacesRepository implements IPlacesRepository {
  private readonly _placesModel = prisma.places;

  /**
   * Constructs the PlacesRepository.
   *
   * @param _geoIndexingService - Service for computing spatial indices for locations
   */
  constructor(private readonly _geoIndexingService: IGeoIndexingService) {}

  /**
   * Computes spatial indices for a list of places and persists them in bulk
   *
   * @param places - Array of place objects without placeIndex
   */
  async addPlaces(places: Omit<PlacesEntity, "placeIndex">[]): Promise<void> {
    const mappedPlaces: PlacesEntity[] = await Promise.all(
      places.map(async (place) => ({
        ...place,
        placeIndex: await this._geoIndexingService.locationToIndex(
          place.placeLat,
          place.placeLng,
        ),
      })),
    );

    await this._placesModel.createMany({
      data: mappedPlaces,
      skipDuplicates: true,
    });
  }
}

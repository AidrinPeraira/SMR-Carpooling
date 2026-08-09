import { IPlacesRepository } from "#/application/interfaces/repository/IPlacesRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { IPlacesCacheStore } from "#/application/interfaces/store/IPlacesCacheStore";
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
   * @param _placesCacheStore - Store for caching spatial indices in Redis
   */
  constructor(
    private readonly _geoIndexingService: IGeoIndexingService,
    private readonly _placesCacheStore: IPlacesCacheStore,
  ) {}

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

    const indexStrings = mappedPlaces.map((p) => p.placeIndex);
    if (indexStrings.length > 0 && this._placesCacheStore) {
      await this._placesCacheStore.addPlaceIndices(indexStrings);
    }
  }
}

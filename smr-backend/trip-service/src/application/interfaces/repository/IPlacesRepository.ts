import { PlacesEntity } from "#/domain/entities/PlacesEntity";

/**
 * This is the repository for places for predetermined stops
 */
export interface IPlacesRepository {
  addPlaces(places: Omit<PlacesEntity, "placeIndex">[]): Promise<void>;
}

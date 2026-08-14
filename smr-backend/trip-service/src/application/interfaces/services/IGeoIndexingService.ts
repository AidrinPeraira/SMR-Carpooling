/**
 * Service interface for converting spatial coordinates (latitude, longitude)
 * to/from spatial index representations.
 */
export interface IGeoIndexingService {
  /**
   * Converts latitude and longitude coordinates into a spatial BigInt index.
   *
   * @param lat - Latitude coordinate
   * @param lng - Longitude coordinate
   * @returns BigInt spatial index
   */
  locationToIndex(lat: number, lng: number): Promise<string>;

  /**
   * Convert a given point to an array of indieces. the point and its neighbour
   *
   * @param lat - Latitude coordinate
   * @param lng - Longitude coordinate
   * @returns Spatial index array
   */
  locationToAreaIndices(lat: number, lng: number): Promise<string[]>;

  /**
   * Converts a spatial index back into latitude and longitude coordinates.
   *
   * @param index - Spatial index string
   * @returns Object containing latitude and longitude
   */
  indexToLocation(index: string): Promise<{ lat: number; lng: number }>;
}


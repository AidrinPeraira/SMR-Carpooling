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
  locationToIndex(lat: number, lng: number): Promise<bigint>;

  /**
   * Converts a BigInt spatial index back into latitude and longitude coordinates.
   *
   * @param index - BigInt spatial index
   * @returns Object containing latitude and longitude
   */
  indexToLocation(index: bigint): Promise<{ lat: number; lng: number }>;
}

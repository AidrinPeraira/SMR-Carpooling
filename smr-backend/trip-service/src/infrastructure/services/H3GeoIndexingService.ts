import { cellToLatLng, gridDisk, latLngToCell } from "h3-js";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";

/**
 * Implementation of IGeoIndexingService using Uber H3 spatial indexing system.
 */
export class H3GeoIndexingService implements IGeoIndexingService {
  /**
   * Constructs the H3GeoIndexingService.
   *
   * @param _resolution - The H3 resolution level (default 8)
   * @param _radiusSteps - The number of index rings to match around a point when buffered
   */
  constructor(
    private readonly _resolution: number = 8,
    private readonly _radiusSteps = 3,
  ) {}

  /**
   * Converts latitude and longitude to a BigInt H3 spatial index.
   *
   * @param lat - Latitude coordinate
   * @param lng - Longitude coordinate
   * @returns BigInt representation of the H3 index
   */
  async locationToIndex(lat: number, lng: number): Promise<string> {
    return latLngToCell(lat, lng, this._resolution);
  }

  async locationToAreaIndices(lat: number, lng: number): Promise<string[]> {
    const index = latLngToCell(lat, lng, this._resolution);
    return gridDisk(index, this._radiusSteps);
  }

  /**
   * Converts an H3 spatial index back into latitude and longitude coordinates.
   *
   * @param index - H3 index string
   * @returns Object containing latitude and longitude coordinates
   */
  async indexToLocation(index: string): Promise<{ lat: number; lng: number }> {
    const [lat, lng] = cellToLatLng(index);
    return { lat, lng };
  }
}

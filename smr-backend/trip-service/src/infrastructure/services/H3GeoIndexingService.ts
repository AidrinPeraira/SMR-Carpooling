import { cellToLatLng, latLngToCell } from "h3-js";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";

/**
 * Implementation of IGeoIndexingService using Uber H3 spatial indexing system.
 */
export class H3GeoIndexingService implements IGeoIndexingService {
  /**
   * Constructs the H3GeoIndexingService.
   *
   * @param _resolution - The H3 resolution level (defaults to 7 for ~1.2 km2 hexagon cell area)
   */
  constructor(private readonly _resolution: number = 7) {}

  /**
   * Converts latitude and longitude to a BigInt H3 spatial index.
   *
   * @param lat - Latitude coordinate
   * @param lng - Longitude coordinate
   * @returns BigInt representation of the H3 index
   */
  async locationToIndex(lat: number, lng: number): Promise<bigint> {
    const hexIndex = latLngToCell(lat, lng, this._resolution);
    return BigInt(`0x${hexIndex}`);
  }

  /**
   * Converts a BigInt H3 spatial index back into latitude and longitude coordinates.
   *
   * @param index - BigInt representation of the H3 index
   * @returns Object containing latitude and longitude coordinates
   */
  async indexToLocation(index: bigint): Promise<{ lat: number; lng: number }> {
    const hexIndex = index.toString(16);
    const [lat, lng] = cellToLatLng(hexIndex);
    return { lat, lng };
  }
}

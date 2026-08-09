/**
 * Represents a geographical place entity with spatial indexing
 */
export interface PlacesEntity {
  placeIndex: bigint;
  placeName: string;
  placeLat: number;
  placeLng: number;
  placeAddress: string;
}

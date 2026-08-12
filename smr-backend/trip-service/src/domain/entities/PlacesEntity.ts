/**
 * Represents a geographical place entity with spatial indexing
 */
export interface PlacesEntity {
  placeIndex: string;
  placeName: string;
  placeLat: number;
  placeLng: number;
  placeAddress: string;
}

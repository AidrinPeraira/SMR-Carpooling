/**
 * Interface for spatial places cache store operations.
 * Caches valid place indices to optimize trip creation.
 */
export interface IPlacesCacheStore {
  /**
   * Adds spatial place index strings to the Redis cache set.
   *
   * @param indices Array of place index strings to cache
   */
  addPlaceIndices(indices: string[]): Promise<void>;

  /**
   * Checks which place index strings exist in the Redis cache set.
   *
   * @param indices Array of place index strings to check
   * @returns Array of numbers (1 if cached, 0 if not cached)
   */
  checkPlaceIndices(indices: string[]): Promise<number[]>;

  /**
   * Checks whether the places cache set exists in Redis.
   *
   * @returns Boolean indicating if the cache key exists
   */
  hasCache(): Promise<boolean>;

  /**
   * Optional method to get a cached place record by place name.
   */
  get?(placeName: string): Promise<{
    placeId: string;
    location: { coordinates: [number, number] };
  } | null>;
}

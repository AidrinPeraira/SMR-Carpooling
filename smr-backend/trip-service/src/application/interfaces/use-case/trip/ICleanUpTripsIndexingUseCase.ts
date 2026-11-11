/**
 * This use case cleans up past trips from the trips indexed record
 * to keep querying fast.
 */
export interface ICleanUpTripsIndexingUseCase {
  execute(): Promise<void>;
}

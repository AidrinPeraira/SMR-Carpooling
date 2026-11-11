/**
 * This use case handles aggregating the details of a trip
 * and its confirmed bookings and passengers and creating
 * the needed journey data from the available information
 */
export interface IStartTripJourneyUseCase {
  execute(tripId: string, driverId: string): Promise<void>;
}

/**
 * This use case handeles starting a trip on the trip date
 *  - It checks the date and if it is the same as trip date it starts
 *  - It finds the list of bookings for the trip.
 *  - It gets the stops and arranges them in the order for the trip.
 *  - Creates a new trip journey and creates journey passengers from the confirmed bookings for the trip
 *  - It updates the trip status as active.
 */
export interface IDriverStartTripUseCase {
  execute(tripId: string, driverId: string): Promise<void>;
}

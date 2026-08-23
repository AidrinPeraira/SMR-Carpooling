/**
 * This is the use case that handles canceling trip by driver,
 * cancels bookings and and issues events to process refund
 * for confirmed bookings
 */
export interface ICancelTripUseCas {
  execute(tripId: string, driverId: string): Promise<void>;
}

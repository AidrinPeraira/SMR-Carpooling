/**
 * This use case accepts the application for a passenger to join a trip
 * It updates the booking status by verifying the booking state, available seats
 * and also the driver to which the trip booking belongs to
 *
 * It sets the booking status to pending payment
 */
export interface IDriverAcceptBookingUseCase {
  execute(bookingId: string, dirverId: string): Promise<void>;
}

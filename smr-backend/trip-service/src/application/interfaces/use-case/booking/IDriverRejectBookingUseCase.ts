/**
 * This use case rejects the application for a passenger to join a trip
 * It updates the booking status by verifying the booking state
 * and also the driver to which the trip booking belongs to
 */
export interface IDriverRejectBookingUseCase {
  execute(bookingId: string, dirverId: string): Promise<void>;
}

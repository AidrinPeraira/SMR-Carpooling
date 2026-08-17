/**
 * This use case creates a new boooking payment intent.
 * It tracks the status of the booking
 */
export interface INewBookingPayementUseCase {
  execute(): Promise<void>;
}

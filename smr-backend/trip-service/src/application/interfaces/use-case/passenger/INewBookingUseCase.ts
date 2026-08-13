import { NewBookingRequestDTO } from "#/application/dto/trip/BookingDTO";

/**
 * this use case calculates the trip cost
 * and creates a new booking
 */
export interface INewBookingUseCase {
  execute(dto: NewBookingRequestDTO): Promise<void>;
}

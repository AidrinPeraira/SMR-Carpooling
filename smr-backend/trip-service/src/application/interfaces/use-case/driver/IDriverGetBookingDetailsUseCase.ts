import { GetBookingDetailsResultDTO } from "#/application/dto/driver/BookingDetailsDTO";

export interface IDriverGetBookingDetailsUseCase {
  execute(
    bookingId: string,
    driverId: string,
  ): Promise<GetBookingDetailsResultDTO>;
}

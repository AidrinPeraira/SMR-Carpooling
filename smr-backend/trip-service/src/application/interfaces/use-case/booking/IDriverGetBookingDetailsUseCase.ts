import { GetBookingDetailsResultDTO } from "#/application/dto/booking/DriverBookingDetailsDTO";

export interface IDriverGetBookingDetailsUseCase {
  execute(
    bookingId: string,
    driverId: string,
  ): Promise<GetBookingDetailsResultDTO>;
}

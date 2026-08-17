import { GetPassengerBookingDetailsResultDTO } from "#/application/dto/booking/PassengerBookingDetailsDTO";

/**
 * this use case gets details about booking for passenger
 */
export interface IGetPassngerBookingDetailsUseCase {
  execute(
    bookingId: string,
    passengerId: string,
  ): Promise<GetPassengerBookingDetailsResultDTO>;
}

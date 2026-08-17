import {
  PassengerGetAllBookingsQueryDTO,
  PassengerGetAllBookingsResultDTO,
} from "#/application/dto/booking/PassengerBookingDetailsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IPassengerListBookingsUseCase } from "#/application/interfaces/use-case/booking/IPassengerListBookingsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * Use case to list all bookings for a passenger.
 */
export class PassengerListBookingsUseCase
  implements IPassengerListBookingsUseCase
{
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  async execute(
    passengerId: string,
    query?: PassengerGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<PassengerGetAllBookingsResultDTO[]>> {
    return this._bookingRepository.findBookingsByPassengerId(passengerId, query);
  }
}

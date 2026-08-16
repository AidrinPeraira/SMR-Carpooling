import {
  PassengerGetAllBookingsQueryDTO,
  PassengerGetAllBookingsResultDTO,
} from "#/application/dto/booking/PassengerBookingDetailsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This use case lists all bookings by passenger, it filters using status
 * and returns paginagted reuslt
 */
export interface IPassengerListBookingsUseCase {
  execute(
    passengerId: string,
    query: PassengerGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<PassengerGetAllBookingsResultDTO[]>>;
}

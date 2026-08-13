import {
  DriverGetAllBookingsQueryDTO,
  DriverGetAllBookingsResultDTO,
} from "#/application/dto/driver/BookingDetailsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This use case lists all bookings for all trips by driver.
 * It returns a paginated and filtered list of booking data
 */
export interface IDriverListAllBookingsUseCase {
  execute(
    driverId: string,
    query?: DriverGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<DriverGetAllBookingsResultDTO[]>>;
}

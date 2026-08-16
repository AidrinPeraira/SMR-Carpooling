import {
  DriverGetAllBookingsQueryDTO,
  DriverGetAllBookingsResultDTO,
} from "#/application/dto/booking/DriverBookingDetailsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IDriverListAllBookingsUseCase } from "#/application/interfaces/use-case/booking/IDriverListAllBookingsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This class implements the use case that lists all
 * bookings related to a driver for the driver dashboard.
 */
export class DriverListAllBookingsUseCase
  implements IDriverListAllBookingsUseCase
{
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  /**
   * This method finds all bookings of given status in dto and returns
   * a paginated response.
   *
   * @param driverId : id of driver as a string
   * @param dto : Optional query details
   */
  async execute(
    driverId: string,
    dto?: DriverGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<DriverGetAllBookingsResultDTO[]>> {
    return this._bookingRepository.findBookingsByDriverId(driverId, dto);
  }
}

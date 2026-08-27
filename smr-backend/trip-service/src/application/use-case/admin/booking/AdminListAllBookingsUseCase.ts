import {
  AdminListAllBookingsQueryDTO,
  AdminListAllBookingsResponseDTO,
} from "#/application/dto/admin/AdminBookingsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IAdminListAllBookingsUseCase } from "#/application/interfaces/use-case/admin/booking/IAdminListAllBookingsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This class implements the use case to list all bookings
 * on the platform on the admin dashboard
 */
export class AdminListAllBookingsUseCase implements IAdminListAllBookingsUseCase {
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  /**
   * This method takes the query to filter and sort bookings list
   * and returns the paginated result of all available bookings on the platform
   */
  async execute(
    query: AdminListAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<AdminListAllBookingsResponseDTO[]>> {
    if (!this._bookingRepository.findAllBookings) {
      throw new Error("findAllBookings method not implemented in repository");
    }
    return await this._bookingRepository.findAllBookings(query);
  }
}

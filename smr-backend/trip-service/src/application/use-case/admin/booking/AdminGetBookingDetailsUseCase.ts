import { AdminBookingDetiailsResponseDTO } from "#/application/dto/admin/AdminBookingsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IAdminGetBookingDetailsUseCase } from "#/application/interfaces/use-case/admin/booking/IAdminGetBookingDetailsUseCase";
import {
  ApplicationError,
  BookingErrorMessage,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * This class implements the use case to get full details of
 * a single booking for the admin
 */
export class AdminGetBookingDetailsUseCase
  implements IAdminGetBookingDetailsUseCase
{
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  /**
   * This method takes the bookingId and returns full booking details
   * aggregated with trip and driver details for admin dashboard
   *
   * @param bookingId : ID of single booking
   * @returns Full details of booking
   */
  async execute(bookingId: string): Promise<AdminBookingDetiailsResponseDTO> {

    const details =
      await this._bookingRepository.findAdminBookingDetails(bookingId);

    if (!details) {
      throw new ApplicationError(
        BookingErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "AdminGetBookingDetailsUseCase",
          description: `Booking not found with bookingId: ${bookingId}`,
        },
      );
    }

    return details;
  }
}


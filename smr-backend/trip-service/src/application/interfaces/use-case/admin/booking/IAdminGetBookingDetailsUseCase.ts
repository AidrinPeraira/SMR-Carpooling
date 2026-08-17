import { AdminBookingDetiailsResponseDTO } from "#/application/dto/admin/AdminBookingsDTO";

/**
 * This use case gets the full booking details for admin
 * dashboard
 */
export interface IAdminGetBookingDetailsUseCase {
  execute(bookingId: string): Promise<AdminBookingDetiailsResponseDTO>;
}

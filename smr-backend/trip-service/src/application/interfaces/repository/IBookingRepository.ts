import {
  DriverGetAllBookingsQueryDTO,
  DriverGetAllBookingsResultDTO,
} from "#/application/dto/driver/BookingDetailsDTO";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import { BookingStatus, PaginatedPayload } from "@sharemyride/shared";

/**
 * This repository handles booking records
 */
export interface IBookingRepository {
  save(booking: Omit<BookingEntity, "bookingId">): Promise<BookingEntity>;

  updateStatus(
    bookingId: string,
    newStatus: BookingStatus,
  ): Promise<BookingEntity>;

  findByBookingId(bookingId: string): Promise<BookingEntity | null>;

  findBookingsByDriverId(
    driverId: string,
    query?: DriverGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<DriverGetAllBookingsResultDTO[]>>;
}

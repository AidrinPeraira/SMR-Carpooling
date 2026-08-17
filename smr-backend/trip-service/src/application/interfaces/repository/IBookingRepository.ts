import {
  AdminBookingDetiailsResponseDTO,
  AdminListAllBookingsQueryDTO,
  AdminListAllBookingsResponseDTO,
} from "#/application/dto/admin/AdminBookingsDTO";
import {
  DriverGetAllBookingsQueryDTO,
  DriverGetAllBookingsResultDTO,
} from "#/application/dto/booking/DriverBookingDetailsDTO";
import {
  PassengerGetAllBookingsQueryDTO,
  PassengerGetAllBookingsResultDTO,
} from "#/application/dto/booking/PassengerBookingDetailsDTO";
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

  findBookingsByPassengerId(
    passengerId: string,
    query?: PassengerGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<PassengerGetAllBookingsResultDTO[]>>;

  findAllBookings?(
    query: AdminListAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<AdminListAllBookingsResponseDTO[]>>;

  findAdminBookingDetails?(
    bookingId: string,
  ): Promise<AdminBookingDetiailsResponseDTO | null>;
}



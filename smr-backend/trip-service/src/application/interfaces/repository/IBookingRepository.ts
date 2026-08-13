import { BookingEntity } from "#/domain/entities/BookingEntity";

/**
 * This repository handles booking records
 */
export interface IBookingRepository {
  save(trip: Omit<BookingEntity, "bookingId">): Promise<BookingEntity>;
}

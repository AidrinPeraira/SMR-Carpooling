import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import { prisma } from "#/infrastructure/database/prisma";

export class BookingsRepository implements IBookingRepository {
  private readonly _bookingsModel = prisma.bookings;

  /**
   * Saves a new booking to the database
   * @param booking Booking details excluding bookingId
   */
  async save(booking: Omit<BookingEntity, "bookingId">): Promise<void> {
    await this._bookingsModel.create({
      data: {
        passengerId: booking.passengerId,
        tripId: booking.tripId,
        pickupPoint: booking.pickupPoint as any,
        dropOffPoint: booking.dropOffPoint as any,
        pickupPlaceId: booking.pickupPlaceId,
        dropOffPlaceId: booking.dropOffPlaceId,
        distanceKm: booking.distanceKm,
        seatCount: booking.seatCount,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    });
  }
}

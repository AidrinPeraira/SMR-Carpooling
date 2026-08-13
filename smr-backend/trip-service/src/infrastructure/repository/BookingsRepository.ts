import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import { prisma } from "#/infrastructure/database/prisma";

export class BookingsRepository implements IBookingRepository {
  private readonly _bookingsModel = prisma.bookings;
  private readonly _placesModel = prisma.places;

  constructor(private readonly _geoIndexingService: IGeoIndexingService) {}

  /**
   * Saves a new booking to the database
   * @param booking Booking details excluding bookingId
   */
  async save(booking: Omit<BookingEntity, "bookingId">): Promise<BookingEntity> {
    const pickupPlaceIndex = await this._geoIndexingService.locationToIndex(
      booking.pickupPoint.stopLat,
      booking.pickupPoint.stopLng,
    );

    const dropOffPlaceIndex = await this._geoIndexingService.locationToIndex(
      booking.dropOffPoint.stopLat,
      booking.dropOffPoint.stopLng,
    );

    // Ensure Places entries exist in database to satisfy foreign key constraints
    await this._placesModel.createMany({
      data: [
        {
          placeIndex: pickupPlaceIndex,
          placeName: booking.pickupPoint.stopName,
          placeLat: booking.pickupPoint.stopLat,
          placeLng: booking.pickupPoint.stopLng,
          placeAddress: booking.pickupPoint.stopAddress,
        },
        {
          placeIndex: dropOffPlaceIndex,
          placeName: booking.dropOffPoint.stopName,
          placeLat: booking.dropOffPoint.stopLat,
          placeLng: booking.dropOffPoint.stopLng,
          placeAddress: booking.dropOffPoint.stopAddress,
        },
      ],
      skipDuplicates: true,
    });

    const created = await this._bookingsModel.create({
      data: {
        passengerId: booking.passengerId,
        tripId: booking.tripId,
        pickupPoint: booking.pickupPoint as any,
        dropOffPoint: booking.dropOffPoint as any,
        pickupPlaceId: pickupPlaceIndex,
        dropOffPlaceId: dropOffPlaceIndex,
        distanceKm: booking.distanceKm,
        seatCount: booking.seatCount,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    });

    return {
      bookingId: created.bookingId,
      passengerId: created.passengerId,
      tripId: created.tripId,
      pickupPoint: created.pickupPoint as any,
      dropOffPoint: created.dropOffPoint as any,
      pickupPlaceId: created.pickupPlaceId,
      dropOffPlaceId: created.dropOffPlaceId,
      distanceKm: created.distanceKm,
      seatCount: created.seatCount,
      totalPrice: created.totalPrice,
      status: created.status as any,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}

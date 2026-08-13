import {
  DriverGetAllBookingsQueryDTO,
  DriverGetAllBookingsResultDTO,
} from "#/application/dto/driver/BookingDetailsDTO";
import {
  PassengerGetAllBookingsQueryDTO,
  PassengerGetAllBookingsResultDTO,
} from "#/application/dto/passenger/BookingDetailsDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { Prisma } from "#/infrastructure/database/generated/prisma/client";
import { BookingStatus, PaginatedPayload } from "@sharemyride/shared";

export class BookingsRepository implements IBookingRepository {
  private readonly _bookingsModel = prisma.bookings;

  constructor(private readonly _geoIndexingService: IGeoIndexingService) {}

  /**
   * Saves a new booking to the database
   * @param booking Booking details excluding bookingId
   */
  async save(
    booking: Omit<BookingEntity, "bookingId">,
  ): Promise<BookingEntity> {
    const pickupPlaceIndex = await this._geoIndexingService.locationToIndex(
      booking.pickupPoint.stopLat,
      booking.pickupPoint.stopLng,
    );

    const dropOffPlaceIndex = await this._geoIndexingService.locationToIndex(
      booking.dropOffPoint.stopLat,
      booking.dropOffPoint.stopLng,
    );

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

  /**
   * Finds all bookings for trips driven by a specific driver, filtered and paginated.
   * Joins Passenger, Trip, and Vehicle tables.
   */
  async findBookingsByDriverId(
    driverId: string,
    query?: DriverGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<DriverGetAllBookingsResultDTO[]>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingsWhereInput = {
      trip: {
        driverId,
      },
      ...(query?.bookingStatus ? { status: query.bookingStatus } : {}),
    };

    const [totalItems, records] = await Promise.all([
      this._bookingsModel.count({ where }),
      this._bookingsModel.findMany({
        where,
        include: {
          passenger: true,
          trip: {
            include: {
              vehicle: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    const data: DriverGetAllBookingsResultDTO[] = records.map((b) => ({
      bookingId: b.bookingId,
      passngerName: `${b.passenger.firstName} ${b.passenger.lastName}`.trim(),
      tripDate: b.trip.startTime,
      tripVehicle:
        `${b.trip.vehicle.vehicleMake} ${b.trip.vehicle.vehicleModel}`.trim(),
      pickupPointName: (b.pickupPoint as any)?.stopName || "",
      pickupPointAddress: (b.pickupPoint as any)?.stopAddress || "",
      dropOffPointName: (b.dropOffPoint as any)?.stopName || "",
      dropOffPointAddress: (b.dropOffPoint as any)?.stopAddress || "",
      bookingDistance: b.distanceKm,
      seatCount: b.seatCount,
      status: b.status as BookingStatus,
      totalPrice: b.totalPrice,
    }));

    return {
      data,
      paginationMeta: {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * Finds a single booking by bookingId
   */
  async findByBookingId(bookingId: string): Promise<BookingEntity | null> {
    const booking = await this._bookingsModel.findUnique({
      where: { bookingId },
    });

    if (!booking) return null;

    return {
      bookingId: booking.bookingId,
      passengerId: booking.passengerId,
      tripId: booking.tripId,
      pickupPoint: booking.pickupPoint as any,
      dropOffPoint: booking.dropOffPoint as any,
      pickupPlaceId: booking.pickupPlaceId,
      dropOffPlaceId: booking.dropOffPlaceId,
      distanceKm: booking.distanceKm,
      seatCount: booking.seatCount,
      totalPrice: booking.totalPrice,
      status: booking.status as any,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  /**
   * Updates the status of a booking
   */
  async updateStatus(
    bookingId: string,
    newStatus: BookingStatus,
  ): Promise<BookingEntity> {
    const updated = await this._bookingsModel.update({
      where: { bookingId },
      data: { status: newStatus as any },
    });

    return {
      bookingId: updated.bookingId,
      passengerId: updated.passengerId,
      tripId: updated.tripId,
      pickupPoint: updated.pickupPoint as any,
      dropOffPoint: updated.dropOffPoint as any,
      pickupPlaceId: updated.pickupPlaceId,
      dropOffPlaceId: updated.dropOffPlaceId,
      distanceKm: updated.distanceKm,
      seatCount: updated.seatCount,
      totalPrice: updated.totalPrice,
      status: updated.status as any,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Finds all bookings belonging to a passenger
   */
  async findBookingsByPassengerId(
    passengerId: string,
    query?: PassengerGetAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<PassengerGetAllBookingsResultDTO[]>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      passengerId,
    };

    if (query?.bookingStatus && query.bookingStatus.toLowerCase() !== "all") {
      where.status = query.bookingStatus;
    }

    const [totalItems, records] = await Promise.all([
      this._bookingsModel.count({ where }),
      this._bookingsModel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          trip: {
            include: {
              driver: true,
              vehicle: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    const data: PassengerGetAllBookingsResultDTO[] = records.map((b) => {
      const trip = (b as any).trip;
      const driver = trip?.driver;
      const vehicle = trip?.vehicle;
      return {
        bookingId: b.bookingId,
        driverName: driver
          ? `${driver.firstName} ${driver.lastName}`.trim()
          : "Driver",
        tripDate: trip?.startTime || b.createdAt,
        tripVehicle: vehicle
          ? `${vehicle.vehicleMake} ${vehicle.vehicleModel}`.trim()
          : "Vehicle",
        pickupPointName: (b.pickupPoint as any)?.stopName || "",
        pickupPointAddress: (b.pickupPoint as any)?.stopAddress || "",
        dropOffPointName: (b.dropOffPoint as any)?.stopName || "",
        dropOffPointAddress: (b.dropOffPoint as any)?.stopAddress || "",
        bookingDistance: b.distanceKm,
        seatCount: b.seatCount,
        status: b.status as BookingStatus,
        totalPrice: b.totalPrice,
      };
    });

    return {
      data,
      paginationMeta: {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }
}

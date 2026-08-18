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
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { Prisma } from "#/infrastructure/database/generated/prisma/client";
import { BookingStatus, PaginatedPayload, Route, TripStop } from "@sharemyride/shared";

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
        ...(booking.paymentKey !== undefined ? { paymentKey: booking.paymentKey } : {}),
        ...(booking.paymentKeyExpiry !== undefined ? { paymentKeyExpiry: booking.paymentKeyExpiry } : {}),
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
      paymentKey: (created as any).paymentKey ?? undefined,
      paymentKeyExpiry: (created as any).paymentKeyExpiry ?? undefined,
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
      paymentKey: (booking as any).paymentKey ?? undefined,
      paymentKeyExpiry: (booking as any).paymentKeyExpiry ?? undefined,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  /**
   * Updates fields of a booking by bookingId
   */
  async update(
    bookingId: string,
    data: Partial<Omit<BookingEntity, "bookingId" | "createdAt" | "updatedAt">>,
  ): Promise<BookingEntity> {
    const updateData: Prisma.BookingsUpdateInput = {};

    if (data.status !== undefined) updateData.status = data.status as any;
    if (data.paymentKey !== undefined) updateData.paymentKey = data.paymentKey;
    if (data.paymentKeyExpiry !== undefined) updateData.paymentKeyExpiry = data.paymentKeyExpiry;
    if (data.totalPrice !== undefined) updateData.totalPrice = data.totalPrice;
    if (data.seatCount !== undefined) updateData.seatCount = data.seatCount;
    if (data.distanceKm !== undefined) updateData.distanceKm = data.distanceKm;

    const updated = await this._bookingsModel.update({
      where: { bookingId },
      data: updateData,
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
      paymentKey: (updated as any).paymentKey ?? undefined,
      paymentKeyExpiry: (updated as any).paymentKeyExpiry ?? undefined,
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

  /**
   * Finds all bookings for admin dashboard with pagination and search
   */
  async findAllBookings(
    query: AdminListAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<AdminListAllBookingsResponseDTO[]>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingsWhereInput = {};

    if (query?.search) {
      const search = query.search;
      where.OR = [
        { bookingId: { contains: search, mode: "insensitive" } },
        { passengerId: { contains: search, mode: "insensitive" } },
        { tripId: { contains: search, mode: "insensitive" } },
        { passenger: { firstName: { contains: search, mode: "insensitive" } } },
        { passenger: { lastName: { contains: search, mode: "insensitive" } } },
        { pickupPoint: { path: ["stopName"], string_contains: search } },
        { pickupPoint: { path: ["stopAddress"], string_contains: search } },
        { pickupPoint: { path: ["name"], string_contains: search } },
        { pickupPoint: { path: ["address"], string_contains: search } },
        { dropOffPoint: { path: ["stopName"], string_contains: search } },
        { dropOffPoint: { path: ["stopAddress"], string_contains: search } },
        { dropOffPoint: { path: ["name"], string_contains: search } },
        { dropOffPoint: { path: ["address"], string_contains: search } },
      ];
    }

    if (query?.filterField && query?.filterValue && (query.filterField as any) !== "None" && (query.filterValue as any) !== "None") {
      const field = String(query.filterField);
      const val = String(query.filterValue);
      if (field === "status") {
        where.status = val.toLowerCase() as Prisma.EnumBookingStatusFilter;
      } else if (field === "passengerName") {
        where.passenger = {
          OR: [
            { firstName: { contains: val, mode: "insensitive" } },
            { lastName: { contains: val, mode: "insensitive" } },
          ],
        };
      }
    }

    let orderBy: Prisma.BookingsOrderByWithRelationInput = { createdAt: "desc" };
    if (query?.sortField && (query.sortField as any) !== "None") {
      const sortOrder = query.sortValue?.toLowerCase() === "asc" ? "asc" : "desc";
      const field = String(query.sortField);

      if (field === "passengerName") {
        orderBy = { passenger: { firstName: sortOrder } };
      } else if (field === "tripDate") {
        orderBy = { trip: { startTime: sortOrder } };
      } else if (field === "status") {
        orderBy = { status: sortOrder };
      } else if (field === "bookingId") {
        orderBy = { bookingId: sortOrder };
      } else {
        orderBy = { createdAt: sortOrder };
      }
    }

    const [totalItems, records] = await Promise.all([
      this._bookingsModel.count({ where }),
      this._bookingsModel.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          passenger: true,
          trip: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    const data: AdminListAllBookingsResponseDTO[] = records.map((b) => {
      const passengerName = b.passenger
        ? `${b.passenger.firstName} ${b.passenger.lastName}`.trim()
        : "Passenger";
      const bookingOrigin =
        (b.pickupPoint as any)?.stopName ||
        (b.pickupPoint as any)?.stopAddress ||
        (b.pickupPoint as any)?.name ||
        "";
      const bookingDestination =
        (b.dropOffPoint as any)?.stopName ||
        (b.dropOffPoint as any)?.stopAddress ||
        (b.dropOffPoint as any)?.name ||
        "";

      return {
        bookingId: b.bookingId,
        passengerName,
        bookingOrigin,
        bookingDestination,
        status: b.status as BookingStatus,
        tripDate: b.trip?.startTime || b.createdAt,
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

  /**
   * Finds detailed booking information joined with passenger, trip, and vehicle for admin dashboard
   */
  async findAdminBookingDetails(
    bookingId: string,
  ): Promise<AdminBookingDetiailsResponseDTO | null> {
    const booking = await this._bookingsModel.findUnique({
      where: { bookingId },
      include: {
        passenger: true,
        trip: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    if (!booking || !booking.trip) return null;

    const passengerName = booking.passenger
      ? `${booking.passenger.firstName} ${booking.passenger.lastName}`.trim()
      : "Passenger";

    const vehicle = booking.trip.vehicle;
    const vehicelName = vehicle
      ? `${vehicle.vehicleMake} ${vehicle.vehicleModel}`.trim()
      : "Vehicle";

    return {
      bookingId: booking.bookingId,
      tripId: booking.tripId,
      tripDate:
        booking.trip.startTime instanceof Date
          ? booking.trip.startTime.toISOString()
          : String(booking.trip.startTime),
      tripOrigin: booking.trip.tripOrigin as unknown as TripStop,
      tripDestination: booking.trip.tripDestination as unknown as TripStop,
      tripRoute: booking.trip.tripRoute as unknown as Route,
      vehicelName,
      passengerId: booking.passengerId,
      passengerName,
      bookingStatus: booking.status as BookingStatus,
      bookingOrigin: booking.pickupPoint as unknown as TripStop,
      bookingDestination: booking.dropOffPoint as unknown as TripStop,
      distanceKm: booking.distanceKm,
      seatCount: booking.seatCount,
      totalPrice: booking.totalPrice,
    };
  }
}


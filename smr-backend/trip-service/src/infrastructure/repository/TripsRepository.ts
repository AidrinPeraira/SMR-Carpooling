import {
  AdminGetAllTripsQuery,
  AdminGetAllTripsResponseDTO,
  AdminGetTripDetailsResponseDTO,
} from "#/application/dto/admin/AdminTripsDTO";
import { DriverGetAllTripsQueryDTO } from "#/application/dto/trip/DriverTripsDetailsDTO";
import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/PassengerListTripsDTO";
import {
  BookingEntityWithPassenger,
  ITripRepository,
  JourneyDetailsPayload,
  TripResultPayload,
} from "#/application/interfaces/repository/ITripRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { IPlacesCacheStore } from "#/application/interfaces/store/IPlacesCacheStore";
import { TripEntity } from "#/domain/entities/TripEntity";
import { VehicleEntity } from "#/domain/entities/VehicleEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { Prisma } from "#/infrastructure/database/generated/prisma/client";
import {
  BookingStatus,
  PaginatedPayload,
  Route,
  TripStatus,
  TripStop,
  VehicleStatus,
  VehicleTypes,
} from "@sharemyride/shared";

interface BookingWithPassengerRecord {
  bookingId: string;
  passengerId: string;
  tripId: string;
  pickupPoint: unknown;
  dropOffPoint: unknown;
  pickupPlaceId: string;
  dropOffPlaceId: string;
  distanceKm: number;
  seatCount: number;
  totalPrice: number;
  status: string;
  paymentKey?: string | null;
  paymentKeyExpiry?: Date | null;
  passenger?: { firstName: string; lastName: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TripRecordWithRelations {
  tripId: string;
  driverId: string;
  vehicleId: string;
  tripOrigin: unknown;
  tripDestination: unknown;
  tripStops: unknown;
  tripRoute: unknown;
  tripDistance: number;
  availableSeats: number;
  vacantSeats: number;
  tripTags: string[];
  startTime: Date;
  totalSeats: number;
  tripStatus: string;
  createdAt: Date;
  updatedAt: Date;
  vehicle?: {
    vehicleId: string;
    driverId: string;
    recordId: string;
    vehicleType: string;
    vehicleModel: string;
    vehicleMake: string;
    vehicleCapacity: number;
    registrationNumber: string;
    vehicleImage: string;
    vehicleStatus: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  bookings: BookingWithPassengerRecord[];
}

/**
 * Implementation for the trip repository.
 * It handles trip persistence and spatial indexing using the geo-indexing service provided in constructor.
 */
export class TripsRepository implements ITripRepository {
  private readonly _tripModel = prisma.trip;
  private readonly _tripPlacesModel = prisma.tripPlaces;

  constructor(
    private readonly _geoIndexingService: IGeoIndexingService,
    private readonly _placesCacheStore: IPlacesCacheStore,
  ) {}

  /**
   * Finds trip details with joined vehicle and booking details
   * @param tripId Trip ID
   */
  async findTripDetails(tripId: string): Promise<TripResultPayload> {
    const trip = await this._tripModel.findUnique({
      where: { tripId },
      include: {
        bookings: {
          include: {
            passenger: true,
          },
        },
        vehicle: true,
      },
    });

    if (!trip || !trip.vehicle) return null as unknown as TripResultPayload;

    const vehicle = trip.vehicle;

    const tripDetails: TripEntity = {
      tripId: trip.tripId,
      driverId: trip.driverId,
      vehicleId: trip.vehicleId,
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      tripStops: trip.tripStops as unknown as TripStop[],
      tripRoute: trip.tripRoute as unknown as Route,
      tripDistance: trip.tripDistance,
      availableSeats: trip.availableSeats,
      vacantSeats: trip.vacantSeats,
      tripTags: trip.tripTags,
      startTime: trip.startTime,
      totalSeats: trip.totalSeats,
      tripStatus: trip.tripStatus as TripStatus,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };

    const vehicleDetails: VehicleEntity = {
      vehicleId: vehicle.vehicleId,
      driverId: vehicle.driverId,
      recordId: vehicle.recordId,
      vehicleType: vehicle.vehicleType as VehicleTypes,
      vehicleModel: vehicle.vehicleModel,
      vehicleMake: vehicle.vehicleMake,
      vehicleCapacity: vehicle.vehicleCapacity,
      registrationNumber: vehicle.registrationNumber,
      vehicleImage: vehicle.vehicleImage,
      vehicleStatus: vehicle.vehicleStatus as VehicleStatus,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };

    const bookingDetails: BookingEntityWithPassenger[] = trip.bookings.map(
      (b: BookingWithPassengerRecord) => ({
        bookingId: b.bookingId,
        passengerId: b.passengerId,
        tripId: b.tripId,
        pickupPoint: b.pickupPoint as TripStop,
        dropOffPoint: b.dropOffPoint as TripStop,
        pickupPlaceId: b.pickupPlaceId,
        dropOffPlaceId: b.dropOffPlaceId,
        distanceKm: b.distanceKm,
        seatCount: b.seatCount,
        totalPrice: b.totalPrice,
        status: b.status as BookingStatus,
        paymentKey: b.paymentKey ?? undefined,
        paymentKeyExpiry: b.paymentKeyExpiry ?? undefined,
        passengerName: b.passenger
          ? `${b.passenger.firstName} ${b.passenger.lastName}`
          : undefined,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }),
    );

    return {
      tripDetails,
      vehicleDetails,
      bookingDetails,
    };
  }

  async findTripsByDriverId(
    driverId: string,
    query?: DriverGetAllTripsQueryDTO,
  ): Promise<PaginatedPayload<TripResultPayload[]>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { driverId };
    if (query?.tripStatus && (query.tripStatus as string) !== "all") {
      where.tripStatus = query.tripStatus;
    }

    const [totalItems, records] = await Promise.all([
      this._tripModel.count({ where }),
      this._tripModel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          vehicle: true,
          bookings: {
            include: {
              passenger: true,
            },
          },
        },
      }),
    ]);

    const data: TripResultPayload[] = (
      records as unknown as TripRecordWithRelations[]
    ).map((trip) => {
      const vehicle = trip.vehicle;
      const tripDetails: TripEntity = {
        tripId: trip.tripId,
        driverId: trip.driverId,
        vehicleId: trip.vehicleId,
        tripOrigin: trip.tripOrigin as TripStop,
        tripDestination: trip.tripDestination as TripStop,
        tripStops: trip.tripStops as TripStop[],
        tripRoute: trip.tripRoute as Route,
        tripDistance: trip.tripDistance,
        availableSeats: trip.availableSeats,
        vacantSeats: trip.vacantSeats,
        tripTags: trip.tripTags,
        startTime: trip.startTime,
        totalSeats: trip.totalSeats,
        tripStatus: trip.tripStatus as TripStatus,
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt,
      };

      const vehicleDetails: VehicleEntity = vehicle
        ? {
            vehicleId: vehicle.vehicleId,
            driverId: vehicle.driverId,
            recordId: vehicle.recordId,
            vehicleType: vehicle.vehicleType as VehicleTypes,
            vehicleModel: vehicle.vehicleModel,
            vehicleMake: vehicle.vehicleMake,
            vehicleCapacity: vehicle.vehicleCapacity,
            registrationNumber: vehicle.registrationNumber,
            vehicleImage: vehicle.vehicleImage,
            vehicleStatus: vehicle.vehicleStatus as VehicleStatus,
            createdAt: vehicle.createdAt,
            updatedAt: vehicle.updatedAt,
          }
        : (null as unknown as VehicleEntity);

      const bookingDetails: BookingEntityWithPassenger[] = trip.bookings.map(
        (b: BookingWithPassengerRecord) => ({
          bookingId: b.bookingId,
          passengerId: b.passengerId,
          tripId: b.tripId,
          pickupPoint: b.pickupPoint as TripStop,
          dropOffPoint: b.dropOffPoint as TripStop,
          pickupPlaceId: b.pickupPlaceId,
          dropOffPlaceId: b.dropOffPlaceId,
          distanceKm: b.distanceKm,
          seatCount: b.seatCount,
          totalPrice: b.totalPrice,
          status: b.status as BookingStatus,
          paymentKey: b.paymentKey ?? undefined,
          paymentKeyExpiry: b.paymentKeyExpiry ?? undefined,
          passengerName: b.passenger
            ? `${b.passenger.firstName} ${b.passenger.lastName}`
            : undefined,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        }),
      );

      return {
        tripDetails,
        vehicleDetails,
        bookingDetails,
      };
    });

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data,
      paginationMeta: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * gets route details for the trip service
   */
  async findJourneyDetails(
    tripId: string,
  ): Promise<JourneyDetailsPayload | null> {
    const trip = await this._tripModel.findUnique({
      where: { tripId },
      include: {
        vehicle: true,
        tripPlaces: {
          include: {
            place: true,
          },
          orderBy: {
            seqNumber: "asc",
          },
        },
      },
    });

    if (!trip || !trip.vehicle) return null;

    const tripEntity: TripEntity = {
      tripId: trip.tripId,
      driverId: trip.driverId,
      vehicleId: trip.vehicleId,
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      tripStops: trip.tripStops as unknown as TripStop[],
      tripRoute: trip.tripRoute as unknown as Route,
      tripDistance: trip.tripDistance,
      availableSeats: trip.availableSeats,
      vacantSeats: trip.vacantSeats,
      tripTags: trip.tripTags,
      startTime: trip.startTime,
      totalSeats: trip.totalSeats,
      tripStatus: trip.tripStatus as TripStatus,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };

    // Extract and deduplicate stops from tripPlaces table join
    const visited = new Set<string>();
    const availableStops: TripStop[] = [];

    if (trip.tripPlaces && trip.tripPlaces.length > 0) {
      for (const tp of trip.tripPlaces) {
        if (!tp.place) continue;
        const key = `${tp.place.placeLat},${tp.place.placeLng}`;
        if (!visited.has(key)) {
          visited.add(key);
          availableStops.push({
            stopLat: tp.place.placeLat,
            stopLng: tp.place.placeLng,
            stopName: tp.place.placeName,
            stopAddress: tp.place.placeAddress,
          });
        }
      }
    }

    // Fallback if tripPlaces table is empty
    if (availableStops.length === 0) {
      const fallbackStops = [
        tripEntity.tripOrigin,
        ...(tripEntity.tripStops || []),
        tripEntity.tripDestination,
      ];
      for (const stop of fallbackStops) {
        if (!stop) continue;
        const key = `${stop.stopLat},${stop.stopLng}`;
        if (!visited.has(key)) {
          visited.add(key);
          availableStops.push(stop);
        }
      }
    }

    return {
      trip: tripEntity,
      availableStops,
      vehicleType: trip.vehicle.vehicleType as VehicleTypes,
    };
  }

  /**
   * Finds a single trip entity by tripId
   * @param tripId Trip ID
   */
  async findByTripId(tripId: string): Promise<TripEntity | null> {
    const trip = await this._tripModel.findUnique({
      where: { tripId },
    });

    if (!trip) return null;

    return {
      tripId: trip.tripId,
      driverId: trip.driverId,
      vehicleId: trip.vehicleId,
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      tripStops: trip.tripStops as unknown as TripStop[],
      tripRoute: trip.tripRoute as unknown as Route,
      tripDistance: trip.tripDistance,
      availableSeats: trip.availableSeats,
      vacantSeats: trip.vacantSeats,
      tripTags: trip.tripTags,
      startTime: trip.startTime,
      totalSeats: trip.totalSeats,
      tripStatus: trip.tripStatus as TripStatus,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }

  /**
   * Match data with trips that match using the indexed tables
   * @param dto Search parameters
   */
  async findMatchingTrips(
    dto: ListTripsRequestDTO,
  ): Promise<PaginatedPayload<ListTripsResultDTO[]>> {
    const page = dto.query?.page || 1;
    const limit = dto.query?.limit || 10;
    const skip = (page - 1) * limit;

    // index locations with buffer
    const rawOriginIndices =
      await this._geoIndexingService.locationToAreaIndices(
        dto.origin.stopLat,
        dto.origin.stopLng,
      );
    const rawDestIndices = await this._geoIndexingService.locationToAreaIndices(
      dto.destination.stopLat,
      dto.destination.stopLng,
    );

    // filter indices with known places in cache/db
    const validOriginSet = await this._getValidPlaceIndices(rawOriginIndices);
    const validDestSet = await this._getValidPlaceIndices(rawDestIndices);

    const validOriginIndices = rawOriginIndices.filter((idx) =>
      validOriginSet.has(idx),
    );
    const validDestIndices = rawDestIndices.filter((idx) =>
      validDestSet.has(idx),
    );

    // quickly return if there are no matches
    if (validOriginIndices.length === 0 || validDestIndices.length === 0) {
      return {
        data: [],
        paginationMeta: {
          currentPage: page,
          limit,
          totalItems: 0,
          totalPages: 0,
        },
      };
    }

    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+05:30
    const dtoInIST = new Date(dto.time.getTime() + IST_OFFSET_MS);
    dtoInIST.setUTCHours(0, 0, 0, 0); // midnight of that IST day
    const startOfDayUTC = new Date(dtoInIST.getTime() - IST_OFFSET_MS); // 18:30 UTC prev day
    const endOfDayUTC = new Date(startOfDayUTC.getTime() + 24 * 60 * 60 * 1000);

    // find all trips touching origin
    const originPlaces = await this._tripPlacesModel.findMany({
      where: {
        placeIndex: { in: validOriginIndices },
        tripDate: {
          gte: startOfDayUTC,
          lt: endOfDayUTC,
        },
      },
      select: { tripId: true, seqNumber: true },
    });

    console.log("Origin Places: ", originPlaces);

    // return if no origin matches
    if (originPlaces.length === 0) {
      return {
        data: [],
        paginationMeta: {
          currentPage: page,
          limit,
          totalItems: 0,
          totalPages: 0,
        },
      };
    }

    // Map each tripId to its minimum (earliest) sequence number at origin
    const originTripMap = new Map<string, number>();
    for (const p of originPlaces) {
      const prev = originTripMap.get(p.tripId);
      if (prev === undefined || p.seqNumber < prev) {
        originTripMap.set(p.tripId, p.seqNumber);
      }
    }

    // check for destination places that have the origin trip ids
    const destPlaces = await this._tripPlacesModel.findMany({
      where: {
        placeIndex: { in: validDestIndices },
        tripId: { in: Array.from(originTripMap.keys()) },
      },
      select: { tripId: true, seqNumber: true },
    });

    // check and find suitable matching trip IDs
    const matchingTripIds = Array.from(
      new Set(
        destPlaces
          .filter((v) => {
            const minOrigSeq = originTripMap.get(v.tripId);
            return minOrigSeq !== undefined && minOrigSeq < v.seqNumber;
          })
          .map((v) => v.tripId),
      ),
    );

    // Apply eligibility filters BEFORE computing totalItems so pagination
    // metadata is accurate — ineligible trips (full/cancelled) are excluded first
    const eligibleTrips = await this._tripModel.findMany({
      where: {
        tripId: { in: matchingTripIds },
        vacantSeats: { gt: 0 },
        tripStatus: TripStatus.SCHEDULED,
      },
      select: { tripId: true },
    });

    const eligibleTripIds = eligibleTrips.map((t) => t.tripId);
    const totalItems = eligibleTripIds.length;
    const totalPages = Math.ceil(totalItems / limit);

    if (totalItems === 0) {
      return {
        data: [],
        paginationMeta: {
          currentPage: page,
          limit,
          totalItems: 0,
          totalPages: 0,
        },
      };
    }

    const paginatedTripIds = eligibleTripIds.slice(skip, skip + limit);

    const trips = await this._tripModel.findMany({
      where: { tripId: { in: paginatedTripIds } },
    });

    const vehicleIds = [...new Set(trips.map((t) => t.vehicleId))];
    const driverIds = [...new Set(trips.map((t) => t.driverId))];

    const [vehicles, drivers] = await Promise.all([
      prisma.vehicle.findMany({
        where: { vehicleId: { in: vehicleIds } },
      }),
      prisma.driver.findMany({
        where: { driverId: { in: driverIds } },
      }),
    ]);

    const vehicleTypeMap = new Map(
      vehicles.map((v) => [v.vehicleId, v.vehicleType]),
    );
    const driverNameMap = new Map(
      drivers.map((d) => [d.driverId, `${d.firstName} ${d.lastName}`.trim()]),
    );

    const data: ListTripsResultDTO[] = trips.map((trip) => ({
      tripId: trip.tripId,
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      tripDistance: trip.tripDistance,
      driverName: driverNameMap.get(trip.driverId) || "Driver",
      seatsAvailable: trip.vacantSeats,
      time: trip.startTime,
      vehicleType: (vehicleTypeMap.get(trip.vehicleId) ||
        "car") as VehicleTypes,
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
   * Saves a new trip and indexes its places
   * @param trip Trip entity
   */
  async save(trip: TripEntity): Promise<void> {
    // with buffer for corridor
    const placesWithIndex = (
      await Promise.all(
        trip.tripRoute.map(async (point, i) => {
          const areaIndices =
            await this._geoIndexingService.locationToAreaIndices(
              point[1],
              point[0],
            );
          return areaIndices.map((placeIndex) => ({
            placeIndex,
            tripId: trip.tripId,
            tripDate: trip.startTime,
            seqNumber: i,
            isCompleted: false,
          }));
        }),
      )
    ).flat();

    // Last-wins dedup: if the same cell is covered by multiple route points,
    // keep the entry with the highest seqNumber. This prevents a destination
    // cell from being misclassified with a low seqNumber just because an
    // earlier waypoint's gridDisk expansion happened to overlap it.
    const indexMap = new Map<string, (typeof placesWithIndex)[0]>();
    for (const v of placesWithIndex) {
      indexMap.set(v.placeIndex, v);
    }
    const uniqueTripPlaces = Array.from(indexMap.values());

    // filter this according to places data in cache
    const tripIndices = uniqueTripPlaces.map((v) => v.placeIndex);
    const validIndicesSet = await this._getValidPlaceIndices(tripIndices);

    const filteredTripPlaces = uniqueTripPlaces.filter((place) =>
      validIndicesSet.has(place.placeIndex),
    );

    // create db entries
    await prisma.$transaction([
      this._tripModel.create({
        data: {
          tripId: trip.tripId,
          driverId: trip.driverId,
          vehicleId: trip.vehicleId,
          tripOrigin: trip.tripOrigin as any,
          tripDestination: trip.tripDestination as any,
          tripStops: trip.tripStops as any,
          tripRoute: trip.tripRoute as any,
          tripDistance: trip.tripDistance,
          availableSeats: trip.availableSeats,
          vacantSeats: trip.vacantSeats,
          tripTags: trip.tripTags,
          startTime: trip.startTime,
          totalSeats: trip.totalSeats,
          tripStatus: trip.tripStatus as any,
          createdAt: trip.createdAt,
          updatedAt: trip.updatedAt,
        },
      }),
      this._tripPlacesModel.createMany({
        data: filteredTripPlaces,
      }),
    ]);
  }

  /**
   * Checks Redis for valid place indices.
   * If the Redis cache key does not exist yet, fetches all place rows from the database,
   * caches them in Redis via `addPlaceIndices`, and then performs the index check.
   */
  private async _getValidPlaceIndices(indices: string[]): Promise<Set<string>> {
    if (indices.length === 0) return new Set();

    const cacheExists = await this._placesCacheStore.hasCache();

    if (!cacheExists) {
      const allPlaces = await prisma.places.findMany({
        select: {
          placeIndex: true,
        },
      });

      if (allPlaces.length > 0) {
        const allIndices = allPlaces.map((p) => p.placeIndex);
        await this._placesCacheStore.addPlaceIndices(allIndices);
      }
    }

    const cachedStatus =
      await this._placesCacheStore.checkPlaceIndices(indices);

    return new Set(indices.filter((_, i) => cachedStatus[i] === 1));
  }

  /**
   * Find all trips with driver and vehicle relations formatted for admin dashboard
   */
  async findAllTrips(
    query: AdminGetAllTripsQuery,
  ): Promise<PaginatedPayload<AdminGetAllTripsResponseDTO[]>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TripWhereInput = {};

    if (query?.search) {
      const search = query.search;
      where.OR = [
        { tripId: { contains: search, mode: "insensitive" } },
        { driverId: { contains: search, mode: "insensitive" } },
        { vehicleId: { contains: search, mode: "insensitive" } },
        { driver: { firstName: { contains: search, mode: "insensitive" } } },
        { driver: { lastName: { contains: search, mode: "insensitive" } } },
        { vehicle: { vehicleMake: { contains: search, mode: "insensitive" } } },
        {
          vehicle: { vehicleModel: { contains: search, mode: "insensitive" } },
        },
        { tripOrigin: { path: ["stopName"], string_contains: search } },
        { tripOrigin: { path: ["stopAddress"], string_contains: search } },
        { tripOrigin: { path: ["name"], string_contains: search } },
        { tripOrigin: { path: ["address"], string_contains: search } },
        { tripDestination: { path: ["stopName"], string_contains: search } },
        { tripDestination: { path: ["stopAddress"], string_contains: search } },
        { tripDestination: { path: ["name"], string_contains: search } },
        { tripDestination: { path: ["address"], string_contains: search } },
      ];
    }

    if (
      query?.filterField &&
      query?.filterValue &&
      (query.filterField as any) !== "None" &&
      (query.filterValue as any) !== "None"
    ) {
      const field = String(query.filterField);
      const val = String(query.filterValue);
      if (field === "tripStatus") {
        where.tripStatus = val.toLowerCase() as Prisma.EnumTripStatusFilter;
      } else if (field === "driverName") {
        where.driver = {
          OR: [
            { firstName: { contains: val, mode: "insensitive" } },
            { lastName: { contains: val, mode: "insensitive" } },
          ],
        };
      } else if (field === "vehicleName") {
        where.vehicle = {
          OR: [
            { vehicleMake: { contains: val, mode: "insensitive" } },
            { vehicleModel: { contains: val, mode: "insensitive" } },
          ],
        };
      }
    }

    let orderBy: Prisma.TripOrderByWithRelationInput = { createdAt: "desc" };
    if (query?.sortField && (query.sortField as any) !== "None") {
      const sortOrder =
        query.sortValue?.toLowerCase() === "asc" ? "asc" : "desc";
      const field = String(query.sortField);

      if (field === "driverName") {
        orderBy = { driver: { firstName: sortOrder } };
      } else if (field === "vehicleName") {
        orderBy = { vehicle: { vehicleMake: sortOrder } };
      } else if (field === "startTime") {
        orderBy = { startTime: sortOrder };
      } else if (field === "tripStatus") {
        orderBy = { tripStatus: sortOrder };
      } else if (field === "availableSeats") {
        orderBy = { availableSeats: sortOrder };
      } else if (field === "vacantSeats") {
        orderBy = { vacantSeats: sortOrder };
      } else if (field === "tripId") {
        orderBy = { tripId: sortOrder };
      } else {
        orderBy = { createdAt: sortOrder };
      }
    }

    const [totalItems, records] = await Promise.all([
      this._tripModel.count({ where }),
      this._tripModel.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          driver: true,
          vehicle: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    const items: AdminGetAllTripsResponseDTO[] = records.map((trip: any) => {
      const origin =
        (trip.tripOrigin as unknown as TripStop)?.stopName ||
        (trip.tripOrigin as unknown as TripStop)?.stopAddress ||
        "";
      const destination =
        (trip.tripDestination as unknown as TripStop)?.stopName ||
        (trip.tripDestination as unknown as TripStop)?.stopAddress ||
        "";
      return {
        tripId: trip.tripId,
        driverName:
          `${trip.driver?.firstName || ""} ${trip.driver?.lastName || ""}`.trim(),
        vehicleName:
          `${trip.vehicle?.vehicleMake || ""} ${trip.vehicle?.vehicleModel || ""}`.trim(),
        tripOrigin: origin,
        tripDestination: destination,
        availableSeats: trip.availableSeats,
        vacantSeats: trip.vacantSeats,
        startTime: trip.startTime,
        tripStatus: trip.tripStatus as TripStatus,
      };
    });

    return {
      data: items,
      paginationMeta: {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * Finds full trip details aggregated with driver, vehicle, and bookings for admin dashboard
   */
  async findAdminTripDetails(
    tripId: string,
  ): Promise<AdminGetTripDetailsResponseDTO | null> {
    const trip = await this._tripModel.findUnique({
      where: { tripId },
      include: {
        driver: true,
        vehicle: true,
        bookings: {
          include: {
            passenger: true,
          },
        },
      },
    });

    if (!trip || !trip.driver || !trip.vehicle) return null;

    return {
      tripId: trip.tripId,
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      route: trip.tripRoute as unknown as Route,
      tripDate: trip.startTime,
      vehicleId: trip.vehicleId,
      vehicleName:
        `${trip.vehicle.vehicleMake} ${trip.vehicle.vehicleModel}`.trim(),
      vehicleImage: trip.vehicle.vehicleImage || "",
      driverId: trip.driverId,
      driverName: `${trip.driver.firstName} ${trip.driver.lastName}`.trim(),
      bookings: trip.bookings.map((b: any) => ({
        bookingId: b.bookingId,
        passengerName: b.passenger
          ? `${b.passenger.firstName} ${b.passenger.lastName}`.trim()
          : "Passenger",
        bookingStatus: b.status as BookingStatus,
        bookingOrigin: b.pickupPoint?.name || b.pickupPoint?.address || "",
        bookingDestination:
          b.dropOffPoint?.name || b.dropOffPoint?.address || "",
      })),
    };
  }

  /**
   * Updates fields of a trip record by tripId
   */
  async update(
    tripId: string,
    data: Partial<Omit<TripEntity, "tripId" | "createdAt" | "updatedAt">>,
  ): Promise<TripEntity> {
    const updateData: Prisma.TripUpdateInput = {};

    if (data.driverId !== undefined)
      updateData.driver = { connect: { driverId: data.driverId } };
    if (data.vehicleId !== undefined)
      updateData.vehicle = { connect: { vehicleId: data.vehicleId } };
    if (data.tripOrigin !== undefined)
      updateData.tripOrigin = data.tripOrigin as any;
    if (data.tripDestination !== undefined)
      updateData.tripDestination = data.tripDestination as any;
    if (data.tripStops !== undefined)
      updateData.tripStops = data.tripStops as any;
    if (data.tripRoute !== undefined) updateData.tripRoute = data.tripRoute;
    if (data.tripDistance !== undefined)
      updateData.tripDistance = data.tripDistance;
    if (data.availableSeats !== undefined)
      updateData.availableSeats = data.availableSeats;
    if (data.vacantSeats !== undefined)
      updateData.vacantSeats = data.vacantSeats;
    if (data.tripTags !== undefined) updateData.tripTags = data.tripTags;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.totalSeats !== undefined) updateData.totalSeats = data.totalSeats;
    if (data.tripStatus !== undefined) updateData.tripStatus = data.tripStatus;

    const updated = await this._tripModel.update({
      where: { tripId },
      data: updateData,
    });

    return {
      tripId: updated.tripId,
      driverId: updated.driverId,
      vehicleId: updated.vehicleId,
      tripOrigin: updated.tripOrigin as unknown as TripStop,
      tripDestination: updated.tripDestination as unknown as TripStop,
      tripStops: updated.tripStops as unknown as TripStop[],
      tripRoute: updated.tripRoute as unknown as Route,
      tripDistance: updated.tripDistance,
      availableSeats: updated.availableSeats,
      vacantSeats: updated.vacantSeats,
      tripTags: updated.tripTags,
      startTime: updated.startTime,
      totalSeats: updated.totalSeats,
      tripStatus: updated.tripStatus as TripStatus,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Atomically reserves seats for a trip if sufficient vacant seats exist
   * @param tripId Trip ID
   * @param seatCount Number of seats to reserve
   */
  async atmoicReserveSeat(
    tripId: string,
    seatCount: number,
  ): Promise<TripEntity | null> {
    const result = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { tripId: tripId },
      });

      if (!trip || trip.vacantSeats < seatCount) {
        //return null to rollback transaction
        return null;
      }

      const updatedVacantSeats = trip.vacantSeats - seatCount;
      const newStatus =
        updatedVacantSeats === 0 ? TripStatus.FULLY_BOOKED : trip.tripStatus;

      const updated = await tx.trip.update({
        where: { tripId, vacantSeats: { gte: seatCount } },
        data: {
          vacantSeats: { decrement: seatCount },
          tripStatus: newStatus,
        },
      });

      if (updated.vacantSeats < 0) return null;

      return {
        tripId: updated.tripId,
        driverId: updated.driverId,
        vehicleId: updated.vehicleId,
        tripOrigin: updated.tripOrigin as unknown as TripStop,
        tripDestination: updated.tripDestination as unknown as TripStop,
        tripStops: updated.tripStops as unknown as TripStop[],
        tripRoute: updated.tripRoute as unknown as Route,
        tripDistance: updated.tripDistance,
        availableSeats: updated.availableSeats,
        vacantSeats: updated.vacantSeats,
        tripTags: updated.tripTags,
        startTime: updated.startTime,
        totalSeats: updated.totalSeats,
        tripStatus: updated.tripStatus as TripStatus,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    });

    return result;
  }

  /**
   * Atomically releases reserved seats back to a trip and updates trip status if no longer fully booked.
   *
   * @param tripId Trip ID
   * @param seatCount Number of seats to release
   */
  async atmoicReleaseSeat(
    tripId: string,
    seatCount: number,
  ): Promise<TripEntity | null> {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { tripId },
      });

      if (!trip) {
        return null;
      }

      const newVacantSeats = trip.vacantSeats + seatCount;
      const newStatus =
        (trip.tripStatus as unknown) === TripStatus.FULLY_BOOKED
          ? TripStatus.SCHEDULED
          : trip.tripStatus;

      const updated = await tx.trip.update({
        where: { tripId },
        data: {
          vacantSeats: newVacantSeats,
          tripStatus: newStatus as any,
        },
      });

      return {
        tripId: updated.tripId,
        driverId: updated.driverId,
        vehicleId: updated.vehicleId,
        tripOrigin: updated.tripOrigin as unknown as TripStop,
        tripDestination: updated.tripDestination as unknown as TripStop,
        tripStops: updated.tripStops as unknown as TripStop[],
        tripRoute: updated.tripRoute as unknown as Route,
        tripDistance: updated.tripDistance,
        availableSeats: updated.availableSeats,
        vacantSeats: updated.vacantSeats,
        tripTags: updated.tripTags,
        startTime: updated.startTime,
        totalSeats: updated.totalSeats,
        tripStatus: updated.tripStatus as TripStatus,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    });
  }
  async cleanIndices(): Promise<void> {
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+05:30
    const dtoInIST = new Date(new Date().getTime() + IST_OFFSET_MS);
    dtoInIST.setUTCHours(0, 0, 0, 0); // midnight of that IST day
    const startOfDayUTC = new Date(dtoInIST.getTime() - IST_OFFSET_MS); // 18:30 UTC prev day

    await this._tripPlacesModel.deleteMany({
      where: {
        tripDate: { lt: startOfDayUTC },
      },
    });
  }
}

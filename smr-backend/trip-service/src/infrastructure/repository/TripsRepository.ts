import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/ListTripsDTO";
import {
  ITripRepository,
  JourneyDetailsPayload,
  TripResultPayload,
} from "#/application/interfaces/repository/ITripRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { IPlacesCacheStore } from "#/application/interfaces/store/IPlacesCacheStore";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import { TripEntity } from "#/domain/entities/TripEntity";
import { VehicleEntity } from "#/domain/entities/VehicleEntity";
import { prisma } from "#/infrastructure/database/prisma";
import {
  BookingStatus,
  PaginatedPayload,
  Route,
  TripStatus,
  TripStop,
  VehicleStatus,
  VehicleTypes,
} from "@sharemyride/shared";

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
        bookings: true,
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

    const bookingDetails: BookingEntity[] = trip.bookings.map((b) => ({
      bookingId: b.bookingId,
      passengerId: b.passengerId,
      tripId: b.tripId,
      pickupPoint: b.pickupPoint as unknown as TripStop,
      dropOffPoint: b.dropOffPoint as unknown as TripStop,
      pickupPlaceId: b.pickupPlaceId,
      dropOffPlaceId: b.dropOffPlaceId,
      distanceKm: b.distanceKm,
      seatCount: b.seatCount,
      totalPrice: b.totalPrice,
      status: b.status as BookingStatus,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    return {
      tripDetails,
      vehicleDetails,
      bookingDetails,
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
    });

    if (!trip) return null;

    const tripPlaces = await this._tripPlacesModel.findMany({
      where: {
        tripId: trip.tripId,
        tripDate: trip.startTime,
      },
      include: {
        place: true,
      },
      orderBy: {
        seqNumber: "asc",
      },
    });

    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicleId: trip.vehicleId },
    });

    const vehicleType = (vehicle?.vehicleType || "car") as VehicleTypes;

    const tripStops: TripStop[] = tripPlaces.map((tp) => ({
      stopLat: tp.place.placeLat,
      stopLng: tp.place.placeLng,
      stopName: tp.place.placeName,
      stopAddress: tp.place.placeAddress,
    }));

    const availableStops: Route = tripPlaces.map((tp) => [
      tp.place.placeLng,
      tp.place.placeLat,
    ]);

    const tripEntity: TripEntity = {
      tripId: trip.tripId,
      driverId: trip.driverId,
      vehicleId: trip.vehicleId,
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      tripStops,
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

    return {
      trip: tripEntity,
      availableStops,
      vehicleType,
    };
  }

  async save(trip: TripEntity): Promise<void> {
    //create indexed data
    //with buffer for corridor
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

    //filter to remove duplicate cells for points
    const visited = new Set<string>();
    const uniqueTripPlaces = placesWithIndex.filter((v) => {
      const key = v.placeIndex;
      if (visited.has(key)) return false;
      visited.add(key);
      return true;
    });

    //filter this according to places data in cache
    const tripIndices = uniqueTripPlaces.map((v) => v.placeIndex);
    const validIndicesSet = await this._getValidPlaceIndices(tripIndices);

    const filteredTripPlaces = uniqueTripPlaces.filter((place) =>
      validIndicesSet.has(place.placeIndex),
    );

    //create db entries
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

  async findMatchingTrips(
    dto: ListTripsRequestDTO,
  ): Promise<PaginatedPayload<ListTripsResultDTO[]>> {
    const page = dto.query?.page || 1;
    const limit = dto.query?.limit || 10;
    const skip = (page - 1) * limit;

    //index locatiosn with buffer
    const rawOriginIndices =
      await this._geoIndexingService.locationToAreaIndices(
        dto.origin.stopLat,
        dto.origin.stopLng,
      );
    const rawDestIndices = await this._geoIndexingService.locationToAreaIndices(
      dto.destination.stopLat,
      dto.destination.stopLng,
    );

    //filter indices with known places in cache/db
    const validOriginSet = await this._getValidPlaceIndices(rawOriginIndices);
    const validDestSet = await this._getValidPlaceIndices(rawDestIndices);

    const validOriginIndices = rawOriginIndices.filter((idx) =>
      validOriginSet.has(idx),
    );
    const validDestIndices = rawDestIndices.filter((idx) =>
      validDestSet.has(idx),
    );

    //quickly return if there is no matches
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

    //find all trips touching origin.
    const originPlaces = await this._tripPlacesModel.findMany({
      where: {
        placeIndex: { in: validOriginIndices },
        tripDate: {
          gte: dto.time,
          lt: new Date(
            new Date(dto.time).setDate(new Date(dto.time).getDate() + 1),
          ),
        },
      },
      select: { tripId: true, seqNumber: true },
    });

    //return if no origin matches
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

    //check for destiontion places that have the origin trip ids
    const destPlaces = await this._tripPlacesModel.findMany({
      where: {
        placeIndex: { in: validDestIndices },
        tripId: { in: Array.from(originTripMap.keys()) },
      },
      select: { tripId: true, seqNumber: true },
    });

    //check and find suitabel
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

    const totalItems = matchingTripIds.length;
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

    const paginatedTripIds = matchingTripIds.slice(skip, skip + limit);

    const trips = await this._tripModel.findMany({
      where: {
        tripId: { in: paginatedTripIds },
        tripStatus: TripStatus.SCHEDULED,
      },
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
      driverName: driverNameMap.get(trip.driverId) || "",
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
   * Finds a single trip entity by tripId
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
    };
  }
}

import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/ListTripsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IGeoIndexingService } from "#/application/interfaces/services/IGeoIndexingService";
import { IPlacesCacheStore } from "#/application/interfaces/store/IPlacesCacheStore";
import { TripEntity } from "#/domain/entities/TripEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { PaginatedPayload, TripStop, VehicleTypes } from "@sharemyride/shared";

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

  async save(trip: TripEntity): Promise<void> {
    //create indexed data

    /*
    //without buffering
    const placesWithIndex = await Promise.all(
      trip.tripRoute.map(async (point, i) => {
        const placeIndex = await this._geoIndexingService.locationToIndex(
          point[1],
          point[0],
        );
        return {
          placeIndex,
          tripId: trip.tripId,
          tripDate: trip.startTime,
          seqNumber: i,
          isCompleted: false,
        };
      }),
    );

    */
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
        tripDate: { gte: dto.time },
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
      where: { tripId: { in: paginatedTripIds } },
    });

    const vehicleIds = [...new Set(trips.map((t) => t.vehicleId))];
    const vehicles = await prisma.vehicle.findMany({
      where: { vehicleId: { in: vehicleIds } },
    });
    const vehicleTypeMap = new Map(
      vehicles.map((v) => [v.vehicleId, v.vehicleType]),
    );

    const data: ListTripsResultDTO[] = trips.map((trip) => ({
      tripId: trip.tripId,
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      tripDistance: trip.tripDistance,
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
}

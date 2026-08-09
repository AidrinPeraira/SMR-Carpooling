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
    const filteredTripIndices =
      await this._placesCacheStore.checkPlaceIndices(tripIndices);

    const filteredTripPlaces = uniqueTripPlaces.filter(
      (_place, i) => filteredTripIndices[i] == 1,
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

    //filter iindices with known places in
    const originCheck =
      await this._placesCacheStore.checkPlaceIndices(rawOriginIndices);
    const destCheck =
      await this._placesCacheStore.checkPlaceIndices(rawDestIndices);

    const validOriginIndices = rawOriginIndices.filter(
      (_, i) => originCheck[i] == 1,
    );
    const validDestIndices = rawDestIndices.filter((_, i) => destCheck[i] == 1);

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
}

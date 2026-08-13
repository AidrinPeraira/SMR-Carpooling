import { DriverGetAllTripsQueryDTO } from "#/application/dto/driver/DriverTripsDTO";
import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/ListTripsDTO";
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
        pickupPoint: b.pickupPoint as unknown as TripStop,
        dropOffPoint: b.dropOffPoint as unknown as TripStop,
        pickupPlaceId: b.pickupPlaceId,
        dropOffPlaceId: b.dropOffPlaceId,
        distanceKm: b.distanceKm,
        seatCount: b.seatCount,
        totalPrice: b.totalPrice,
        status: b.status as BookingStatus,
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
          pickupPoint: b.pickupPoint as unknown as TripStop,
          dropOffPoint: b.dropOffPoint as unknown as TripStop,
          pickupPlaceId: b.pickupPlaceId,
          dropOffPlaceId: b.dropOffPlaceId,
          distanceKm: b.distanceKm,
          seatCount: b.seatCount,
          totalPrice: b.totalPrice,
          status: b.status as BookingStatus,
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
      include: { vehicle: true },
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

    return {
      trip: tripEntity,
      availableStops: trip.tripRoute as unknown as Route,
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
    if (!this._geoIndexingService.searchTrip) {
      return {
        data: [],
        paginationMeta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 10,
        },
      };
    }

    const geoIndexingResults = await this._geoIndexingService.searchTrip({
      pickupCoords: [dto.origin.stopLng, dto.origin.stopLat],
      dropOffCoords: [dto.destination.stopLng, dto.destination.stopLat],
    });

    if (geoIndexingResults.length === 0) {
      return {
        data: [],
        paginationMeta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 10,
        },
      };
    }

    const matchedTripIds = geoIndexingResults.map((t) => t.tripId);
    const trips = await this._tripModel.findMany({
      where: {
        tripId: { in: matchedTripIds },
        vacantSeats: { gt: 0 },
        tripStatus: TripStatus.SCHEDULED,
      },
      include: {
        vehicle: true,
      },
    });

    const data: ListTripsResultDTO[] = trips.map((trip) => ({
      tripId: trip.tripId,
      driverName: (trip as any).vehicle?.driver
        ? `${(trip as any).vehicle.driver.firstName} ${(trip as any).vehicle.driver.lastName}`.trim()
        : "Driver",
      tripOrigin: trip.tripOrigin as unknown as TripStop,
      tripDestination: trip.tripDestination as unknown as TripStop,
      tripDistance: trip.tripDistance,
      seatsAvailable: trip.vacantSeats,
      time: trip.startTime,
      vehicleType: trip.vehicle?.vehicleType as VehicleTypes,
    }));

    return {
      data,
      paginationMeta: {
        totalItems: data.length,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
      },
    };
  }

  /**
   * Saves a new trip and indexes its places
   * @param trip Trip entity
   */
  async save(trip: TripEntity): Promise<void> {
    const placesToInsert: {
      placeId: string;
      placeName: string;
      coordinates: [number, number];
    }[] = [];

    if (this._placesCacheStore?.get) {
      const placeCacheRecordOrigin = await this._placesCacheStore.get(
        trip.tripOrigin.stopName,
      );
      if (!placeCacheRecordOrigin) {
        throw new Error("Place cache record not found");
      }
      placesToInsert.push({
        placeId: placeCacheRecordOrigin.placeId,
        placeName: trip.tripOrigin.stopName,
        coordinates: [
          placeCacheRecordOrigin.location.coordinates[0],
          placeCacheRecordOrigin.location.coordinates[1],
        ],
      });

      const placeCacheRecordDestination = await this._placesCacheStore.get(
        trip.tripDestination.stopName,
      );
      if (!placeCacheRecordDestination) {
        throw new Error("Place cache record not found");
      }
      placesToInsert.push({
        placeId: placeCacheRecordDestination.placeId,
        placeName: trip.tripDestination.stopName,
        coordinates: [
          placeCacheRecordDestination.location.coordinates[0],
          placeCacheRecordDestination.location.coordinates[1],
        ],
      });

      for (const stop of trip.tripStops) {
        const placeCacheRecord = await this._placesCacheStore.get(
          stop.stopName,
        );
        if (!placeCacheRecord) {
          throw new Error("Place cache record not found");
        }
        placesToInsert.push({
          placeId: placeCacheRecord.placeId,
          placeName: stop.stopName,
          coordinates: [
            placeCacheRecord.location.coordinates[0],
            placeCacheRecord.location.coordinates[1],
          ],
        });
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.trip.create({
        data: {
          tripId: trip.tripId,
          driverId: trip.driverId,
          vehicleId: trip.vehicleId,
          tripOrigin: trip.tripOrigin as unknown as object,
          tripDestination: trip.tripDestination as unknown as object,
          tripStops: trip.tripStops as unknown as object,
          tripRoute: trip.tripRoute as unknown as object,
          tripDistance: trip.tripDistance,
          availableSeats: trip.availableSeats,
          vacantSeats: trip.vacantSeats,
          tripTags: trip.tripTags,
          startTime: trip.startTime,
          totalSeats: trip.totalSeats,
          tripStatus: trip.tripStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      for (let i = 0; i < placesToInsert.length; i++) {
        const place = placesToInsert[i];
        if (place) {
          await tx.tripPlaces.create({
            data: {
              tripId: trip.tripId,
              placeIndex: place.placeId,
              seqNumber: i + 1,
              tripDate: trip.startTime,
            },
          });
        }
      }
    });

    if (this._geoIndexingService?.addTripToIndex) {
      await this._geoIndexingService.addTripToIndex({
        tripId: trip.tripId,
        tripRoute: trip.tripRoute,
        stops: placesToInsert.map((p) => ({
          placeId: p.placeId,
          coordinates: p.coordinates,
        })),
      });
    }
  }
}

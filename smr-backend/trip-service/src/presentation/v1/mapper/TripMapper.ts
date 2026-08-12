import { CreateTripRequestDTO } from "#/application/dto/trip/CreateTripRequestDTO";
import {
  GetJourneyDetailsResponseDTO,
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/ListTripsDTO";
import {
  CreateTripSchemaType,
  ListTripsResult,
  PaginatedPayload,
  SearchTripSchemaType,
  TripStop,
  TripStopDTO,
} from "@sharemyride/shared";

export class TripMapper {
  static toTripStop(dto: TripStopDTO): TripStop {
    return {
      stopLat: dto.stop_lat,
      stopLng: dto.stop_lng,
      stopName: dto.stop_name,
      stopAddress: dto.stop_address,
    };
  }

  static toTripStopDTO(stop: TripStop): TripStopDTO {
    return {
      stop_lat: stop.stopLat,
      stop_lng: stop.stopLng,
      stop_name: stop.stopName,
      stop_address: stop.stopAddress,
    };
  }

  static toCreateTripRequestDTO(
    driverId: string,
    body: CreateTripSchemaType,
  ): CreateTripRequestDTO {
    return {
      driverId,
      vehicleId: body.vehicle_id,
      tripOrigin: this.toTripStop(body.trip_origin),
      tripDestination: this.toTripStop(body.trip_destination),
      tripStops: body.trip_stops.map((s) => this.toTripStop(s)),
      tripRoute: body.trip_route,
      tripDistance: body.trip_distance,
      availableSeats: body.available_seats,
      tripTags: body.trip_tags,
      startTime: new Date(body.start_time),
      totalSeats: body.total_seats,
    };
  }

  static toListTripsRequestDTO(
    body: SearchTripSchemaType,
  ): ListTripsRequestDTO {
    return {
      origin: this.toTripStop(body.origin),
      destination: this.toTripStop(body.destination),
      time: new Date(body.time),
      query: body.query
        ? {
            page: body.query.page,
            limit: body.query.limit,
            search: body.query.search,
            searchFields: body.query.searchFields as
              | (keyof ListTripsResultDTO)[]
              | undefined,
            sortValue: body.query.sortValue,
            sortField: body.query.sortField as
              | keyof ListTripsResultDTO
              | undefined,
            filterField: body.query.filterField as
              | keyof ListTripsResultDTO
              | undefined,
            filterValue: body.query.filterValue,
          }
        : undefined,
    };
  }

  static toListTripsResponse(
    payload: PaginatedPayload<ListTripsResultDTO[]>,
  ): PaginatedPayload<ListTripsResult[]> {
    const data: ListTripsResult[] = payload.data.map((item) => ({
      trip_id: item.tripId,
      trip_origin: this.toTripStopDTO(item.tripOrigin),
      trip_destination: this.toTripStopDTO(item.tripDestination),
      trip_distance: item.tripDistance,
      seats_available: item.seatsAvailable,
      time: item.time,
      vehicle_type: item.vehicleType,
    }));

    return {
      data,
      paginationMeta: payload.paginationMeta,
    };
  }

  static toGetJourneyDetailsResponse(dto: GetJourneyDetailsResponseDTO) {
    return {
      trip_id: dto.tripId,
      trip_stops: dto.tripStops.map((stop) => this.toTripStopDTO(stop)),
      trip_route: dto.tripRoute,
      available_stops: dto.availableStops,
      base_price: dto.basePrice,
      price_per_km: dto.pricePerKm,
    };
  }
}

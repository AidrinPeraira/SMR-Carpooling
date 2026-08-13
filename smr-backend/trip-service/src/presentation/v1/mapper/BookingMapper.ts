import {
  DriverGetAllBookingsQueryDTO,
  DriverGetAllBookingsResultDTO,
  GetBookingDetailsResultDTO,
} from "#/application/dto/driver/BookingDetailsDTO";
import {
  GetPassengerBookingDetailsResultDTO,
  PassengerGetAllBookingsQueryDTO,
  PassengerGetAllBookingsResultDTO,
} from "#/application/dto/passenger/BookingDetailsDTO";
import { NewBookingRequestDTO } from "#/application/dto/trip/BookingDTO";
import { TripMapper } from "#/presentation/v1/mapper/TripMapper";
import {
  BookingStatus,
  CreateBookingSchemaType,
  DriverBookingDetailsDTO,
  DriverBookingItemDTO,
  DriverGetBookingsQuerySchemaType,
  PaginatedPayload,
  PassengerBookingDetailsDTO,
  PassengerBookingItemDTO,
  PassengerGetBookingsQuerySchemaType,
} from "@sharemyride/shared";

export class BookingMapper {
  static toNewBookingRequestDTO(
    passengerId: string,
    body: CreateBookingSchemaType,
  ): NewBookingRequestDTO {
    return {
      passengerId,
      tripId: body.trip_id,
      pickupPoint: TripMapper.toTripStop(body.pickup_point),
      dropOffPoint: TripMapper.toTripStop(body.drop_off_point),
      pickupPlaceId: body.pickup_place_id,
      dropOffPlaceId: body.drop_off_place_id,
      seatCount: body.seat_count,
      distanceKm: body.distance_km,
    };
  }

  static toDriverGetAllBookingsQueryDTO(
    query: DriverGetBookingsQuerySchemaType,
  ): DriverGetAllBookingsQueryDTO {
    return {
      bookingStatus: query.booking_status as BookingStatus,
      page: query.page,
      limit: query.limit,
    };
  }

  static toDriverGetAllBookingsResponse(
    payload: PaginatedPayload<DriverGetAllBookingsResultDTO[]>,
  ): PaginatedPayload<DriverBookingItemDTO[]> {
    return {
      data: payload.data.map((item) => ({
        booking_id: item.bookingId,
        passenger_name: item.passngerName,
        trip_date: item.tripDate instanceof Date ? item.tripDate.toISOString() : String(item.tripDate),
        trip_vehicle: item.tripVehicle,
        pickup_point_name: item.pickupPointName,
        pickup_point_address: item.pickupPointAddress,
        drop_off_point_name: item.dropOffPointName,
        drop_off_point_address: item.dropOffPointAddress,
        booking_distance: item.bookingDistance,
        seat_count: item.seatCount,
        status: item.status,
        total_price: item.totalPrice,
      })),
      paginationMeta: payload.paginationMeta,
    };
  }

  static toDriverGetBookingDetailsResponse(
    dto: GetBookingDetailsResultDTO,
  ): DriverBookingDetailsDTO {
    return {
      booking_id: dto.bookingId,
      passenger_name: dto.passngerName,
      trip_date: dto.tripDate instanceof Date ? dto.tripDate.toISOString() : String(dto.tripDate),
      trip_vehicle: dto.tripVehicle,
      trip_route: dto.tripRoute,
      pickup_point: TripMapper.toTripStopDTO(dto.pickupPoint),
      drop_off_point: TripMapper.toTripStopDTO(dto.dropOffPoint),
      booking_distance: dto.bookingDistance,
      seat_count: dto.seatCount,
      status: dto.status,
      total_price: dto.totalPrice,
    };
  }

  static toPassengerGetAllBookingsQueryDTO(
    query: PassengerGetBookingsQuerySchemaType,
  ): PassengerGetAllBookingsQueryDTO {
    return {
      bookingStatus: query.booking_status as BookingStatus,
      page: query.page,
      limit: query.limit,
    };
  }

  static toPassengerGetAllBookingsResponse(
    payload: PaginatedPayload<PassengerGetAllBookingsResultDTO[]>,
  ): PaginatedPayload<PassengerBookingItemDTO[]> {
    return {
      data: payload.data.map((item) => ({
        booking_id: item.bookingId,
        driver_name: item.driverName,
        trip_date: item.tripDate instanceof Date ? item.tripDate.toISOString() : String(item.tripDate),
        trip_vehicle: item.tripVehicle,
        pickup_point_name: item.pickupPointName,
        pickup_point_address: item.pickupPointAddress,
        drop_off_point_name: item.dropOffPointName,
        drop_off_point_address: item.dropOffPointAddress,
        booking_distance: item.bookingDistance,
        seat_count: item.seatCount,
        status: item.status,
        total_price: item.totalPrice,
      })),
      paginationMeta: payload.paginationMeta,
    };
  }

  static toPassengerGetBookingDetailsResponse(
    dto: GetPassengerBookingDetailsResultDTO,
  ): PassengerBookingDetailsDTO {
    return {
      booking_id: dto.bookingId,
      driver_name: dto.driverName,
      trip_date: dto.tripDate instanceof Date ? dto.tripDate.toISOString() : String(dto.tripDate),
      trip_vehicle: dto.tripVehicle,
      trip_vehicle_image: dto.tirpVehicleImage,
      trip_route: dto.tripRoute,
      pickup_point: TripMapper.toTripStopDTO(dto.pickupPoint),
      drop_off_point: TripMapper.toTripStopDTO(dto.dropOffPoint),
      booking_distance: dto.bookingDistance,
      seat_count: dto.seatCount,
      status: dto.status,
      total_price: dto.totalPrice,
    };
  }
}

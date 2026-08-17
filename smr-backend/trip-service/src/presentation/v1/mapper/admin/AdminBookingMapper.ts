import {
  AdminBookingDetiailsResponseDTO,
  AdminListAllBookingsResponseDTO,
} from "#/application/dto/admin/AdminBookingsDTO";
import { TripMapper } from "#/presentation/v1/mapper/TripMapper";
import {
  AdminBookingDetailsDTO,
  AdminBookingItemDTO,
  PaginatedPayload,
} from "@sharemyride/shared";

export class AdminBookingMapper {
  static toAdminBookingListResponse(
    payload: PaginatedPayload<AdminListAllBookingsResponseDTO[]>,
  ): PaginatedPayload<AdminBookingItemDTO[]> {
    return {
      data: payload.data.map((item) => ({
        booking_id: item.bookingId,
        passenger_name: item.passengerName,
        booking_origin: item.bookingOrigin,
        booking_destination: item.bookingDestination,
        status: item.status,
        trip_date: item.tripDate instanceof Date ? item.tripDate.toISOString() : String(item.tripDate),
      })),
      paginationMeta: payload.paginationMeta,
    };
  }

  static toAdminBookingDetailsResponse(
    dto: AdminBookingDetiailsResponseDTO,
  ): AdminBookingDetailsDTO {
    return {
      booking_id: dto.bookingId,
      trip_id: dto.tripId,
      trip_date: dto.tripDate,
      trip_origin: TripMapper.toTripStopDTO(dto.tripOrigin),
      trip_destination: TripMapper.toTripStopDTO(dto.tripDestination),
      trip_route: dto.tripRoute,
      vehicle_name: dto.vehicelName,
      passenger_id: dto.passengerId,
      passenger_name: dto.passengerName,
      booking_status: dto.bookingStatus,
      booking_origin: TripMapper.toTripStopDTO(dto.bookingOrigin),
      booking_destination: TripMapper.toTripStopDTO(dto.bookingDestination),
      distance_km: dto.distanceKm,
      seat_count: dto.seatCount,
      total_price: dto.totalPrice,
    };
  }
}

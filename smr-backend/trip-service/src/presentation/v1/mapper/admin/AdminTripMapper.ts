import {
  AdminGetAllTripsResponseDTO,
  AdminGetTripDetailsResponseDTO,
} from "#/application/dto/admin/AdminTripsDTO";
import { TripMapper } from "#/presentation/v1/mapper/TripMapper";
import {
  AdminTripDetailsDTO,
  AdminTripItemDTO,
  PaginatedPayload,
} from "@sharemyride/shared";

export class AdminTripMapper {
  static toAdminTripListResponse(
    payload: PaginatedPayload<AdminGetAllTripsResponseDTO[]>,
  ): PaginatedPayload<AdminTripItemDTO[]> {
    return {
      data: payload.data.map((item) => ({
        trip_id: item.tripId,
        driver_name: item.driverName,
        vehicle_name: item.vehicleName,
        trip_origin: item.tripOrigin,
        trip_destination: item.tripDestination,
        available_seats: item.availableSeats,
        vacant_seats: item.vacantSeats,
        start_time: item.startTime instanceof Date ? item.startTime.toISOString() : String(item.startTime),
        trip_status: item.tripStatus,
      })),
      paginationMeta: payload.paginationMeta,
    };
  }

  static toAdminTripDetailsResponse(
    dto: AdminGetTripDetailsResponseDTO,
  ): AdminTripDetailsDTO {
    return {
      trip_id: dto.tripId,
      trip_origin: TripMapper.toTripStopDTO(dto.tripOrigin),
      trip_destination: TripMapper.toTripStopDTO(dto.tripDestination),
      route: dto.route,
      trip_date: dto.tripDate instanceof Date ? dto.tripDate.toISOString() : String(dto.tripDate),
      vehicle_id: dto.vehicleId,
      vehicle_name: dto.vehicleName,
      vehicle_image: dto.vehicleImage,
      driver_id: dto.driverId,
      driver_name: dto.driverName,
      bookings: dto.bookings.map((b) => ({
        booking_id: b.bookingId,
        passenger_name: b.passengerName,
        booking_status: b.bookingStatus,
        booking_origin: b.bookingOrigin,
        booking_destination: b.bookingDestination,
      })),
    };
  }
}

import { DriverDetailsDTO } from "#/application/dto/driver/DriverDetailsDTO";
import { DriverOverviewResponseDTO } from "#/application/dto/driver/DriverOverviewDTO";
import {
  GetDriverDetailsResult,
  GetDriverOverviewResult,
} from "@sharemyride/shared";

export class DriverMapper {
  static toDriverDetailsResponse(
    dto: DriverDetailsDTO | null,
  ): GetDriverDetailsResult | null {
    if (!dto) return null;

    return {
      driver_id: dto.driverId,
      record_id: dto.recordId,
      license_number: dto.licenseNumber,
      license_image: dto.licenseImage,
      driver_status: dto.driverStatus,
      created_at: dto.createdAt,
      updated_at: dto.updatedAt,
    };
  }

  static toDriverOverviewResponse(
    dto: DriverOverviewResponseDTO,
  ): GetDriverOverviewResult {
    return {
      driver_status: dto.driverStatus,
      today_trip: dto.todayTrip
        ? {
            trip_id: dto.todayTrip.tripId,
            origin: dto.todayTrip.origin,
            destination: dto.todayTrip.destination,
            start_time: dto.todayTrip.startTime,
            vacant_seats: dto.todayTrip.vacantSeats,
            total_seats: dto.todayTrip.totalSeats,
            trip_status: dto.todayTrip.tripStatus,
          }
        : null,
      recent_bookings: dto.recentBookings.map((b) => ({
        booking_id: b.bookingId,
        passenger_name: b.passengerName,
        pickup: b.pickup,
        drop_off: b.dropOff,
        seat_count: b.seatCount,
        status: b.status,
        total_price: b.totalPrice,
        created_at: b.createdAt,
      })),
      stats: {
        total_trips_completed: dto.stats.totalTripsCompleted,
        total_earnings: dto.stats.totalEarnings,
        total_passengers: dto.stats.totalPassengers,
      },
      active_vehicle: dto.activeVehicle
        ? {
            vehicle_type: dto.activeVehicle.vehicleType,
            vehicle_make: dto.activeVehicle.vehicleMake,
            vehicle_model: dto.activeVehicle.vehicleModel,
            registration_number: dto.activeVehicle.registrationNumber,
            vehicle_status: dto.activeVehicle.vehicleStatus,
          }
        : null,
    };
  }
}

import { DriverDetailsDTO } from "#/application/dto/driver/DriverDetailsDTO";
import { DriverTripStatsResponseDTO } from "#/application/dto/driver/DriverTripStatsResponseDTO";
import { DriverTripStatsResult, GetDriverDetailsResult } from "@sharemyride/shared";

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

  static toDriverTripStatsResponse(
    dto: DriverTripStatsResponseDTO,
  ): DriverTripStatsResult {
    return {
      total_trips: dto.totalTrips,
      trips_this_month: dto.tripsThisMonth,
      total_passengers: dto.totalPassengers,
    };
  }
}

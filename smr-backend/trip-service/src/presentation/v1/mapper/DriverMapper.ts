import { DriverDetailsDTO } from "#/application/dto/driver/DriverDetailsDTO";
import { GetDriverDetailsResult } from "@sharemyride/shared";

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
}

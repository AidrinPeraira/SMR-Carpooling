import { VehicleDetailsDTO } from "#/application/dto/vehicle/VehicleDetailsDTO";
import { GetDriverVehiclesResult } from "@sharemyride/shared";

export class VehicleMapper {
  static toDriverVehiclesResponse(
    dtos: VehicleDetailsDTO[],
  ): GetDriverVehiclesResult[] {
    return dtos.map((dto) => ({
      vehicle_id: dto.vehicleId,
      driver_id: dto.driverId,
      record_id: dto.recordId,
      vehicle_type: dto.vehicleType,
      vehicle_model: dto.vehicleModel,
      vehicle_make: dto.vehicleMake,
      vehicle_capacity: dto.vehicleCapacity,
      registration_number: dto.registrationNumber,
      vehicle_image: dto.vehicleImage,
      vehicle_status: dto.vehicleStatus,
      created_at: dto.createdAt,
      updated_at: dto.updatedAt,
    }));
  }
}

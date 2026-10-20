import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
import { QueryDTO, VehicleTypes } from "@sharemyride/shared";

export type GetAllVehicleRecordsRequestQueryDTO = QueryDTO<VehicleRecordEntity>;

export interface GetAllVehicleRecordsResponseDTO {
  recordId: string;
  applicationId: string;
  vehicleType: VehicleTypes;
  vehicleMake: string;
  vehicleModel: string;
  vehicleCapacity: number;
  registrationNumber: string;
  registrationExpiry: Date;
  insuranceNumber: string;
  insuranceExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

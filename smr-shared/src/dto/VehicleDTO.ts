import { VehicleStatus, VehicleTypes } from "../enums";
import { ApiResponse } from "../responses";

export interface GetDriverVehiclesResult {
  vehicle_id: string;
  driver_id: string;
  record_id: string;
  vehicle_type: VehicleTypes;
  vehicle_model: string;
  vehicle_make: string;
  vehicle_capacity: number;
  registration_number: string;
  vehicle_image: string;
  vehicle_status: VehicleStatus;
  created_at: Date;
  updated_at: Date;
}

export type GetDriverVehiclesResponseDTO = ApiResponse<GetDriverVehiclesResult[]>;

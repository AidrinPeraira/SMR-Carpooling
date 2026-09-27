import { DriverStatus } from "../enums";
import { ApiResponse } from "../responses";

export interface GetDriverDetailsResult {
  driver_id: string;
  record_id: string;
  license_number: string;
  license_image: string;
  driver_status: DriverStatus;
  created_at: Date;
  updated_at: Date;
}

export type GetDriverDetailsResponseDTO = ApiResponse<GetDriverDetailsResult | null>;

import { ApplicationStatus, ApplicationType, VehicleTypes } from "../../enums";

export interface AdminVehicleRecordResult {
  record_id: string;
  application_id: string;
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_capacity: number;
  registration_number: string;
  registration_expiry: Date;
  insurance_number: string;
  insurance_expiry: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AdminVehicleRecordDetailsResult {
  record_id: string;
  application_id: string;
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_capacity: number;
  vehicle_image: string;
  registration_number: string;
  registration_expiry: Date;
  registration_file: string;
  insurance_number: string;
  insurance_expiry: Date;
  insurance_file: string;
  created_at: Date;
  updated_at: Date;
  owner: {
    user_id: string;
    first_name: string;
    last_name: string;
    email_id: string;
  };
  application: {
    application_id: string;
    application_type: ApplicationType;
    application_status: ApplicationStatus;
  };
}

export interface AdminVehicleStatsResult {
  vehicle_id: string;
  record_id: string;
  vehicle_status: string;
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  ongoing_trips: number;
  total_distance_km: number;
  completed_journeys: number;
}

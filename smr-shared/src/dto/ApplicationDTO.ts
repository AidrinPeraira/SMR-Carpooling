import { ApplicationStatus, ApplicationType, VehicleTypes } from "../enums";

export interface OnboardingApplicationRequest {
  license_number: string;
  license_expiry: string | Date;
  license_file: string;
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_capacity: number;
  registration_number: string;
  registration_expiry: string | Date;
  registration_file: string;
  insurance_expiry: string | Date;
  insurance_file: string;
  vehicle_image: string;
}

export interface NewVehicleApplicationRequest {
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_capacity: number;
  registration_number: string;
  registration_expiry: string | Date;
  registration_file: string;
  insurance_expiry: string | Date;
  insurance_file: string;
  vehicle_image: string;
}

export interface RenewDriverApplicationRequest {
  license_number: string;
  license_expiry: string | Date;
  license_file: string;
}

export interface RenewVehicleApplicationRequest {
  registration_number: string;
  registration_expiry: string | Date;
  registration_file: string;
  insurance_expiry: string | Date;
  insurance_file: string;
}

export interface ResubmitOnboardingApplicationRequest {
  license_number?: string;
  license_expiry?: string | Date;
  license_file?: string;
  vehicle_type?: VehicleTypes;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_capacity?: number;
  registration_number?: string;
  registration_expiry?: string | Date;
  registration_file?: string;
  insurance_expiry?: string | Date;
  insurance_file?: string;
  vehicle_image?: string;
}

export interface ResubmitNewVehicleApplicationRequest {
  vehicle_type?: VehicleTypes;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_capacity?: number;
  registration_number?: string;
  registration_expiry?: string | Date;
  registration_file?: string;
  insurance_expiry?: string | Date;
  insurance_file?: string;
  vehicle_image?: string;
}

export interface ResubmitRenewDriverApplicationRequest {
  license_number?: string;
  license_expiry?: string | Date;
  license_file?: string;
}

export interface ResubmitRenewVehicleApplicationRequest {
  registration_number?: string;
  registration_expiry?: string | Date;
  registration_file?: string;
  insurance_expiry?: string | Date;
  insurance_file?: string;
}

export interface AdminCommentResult {
  comment: string;
  admin_id: string;
  time: Date;
}

export interface ApplicationResult {
  application_id: string;
  user_id: string;
  application_type: ApplicationType;
  application_status: ApplicationStatus;
  created_at: Date;
  updated_at: Date;
  admin_comments?: AdminCommentResult[];
}

export interface DriverRecordResult {
  record_id: string;
  user_id: string;
  license_number: string;
  license_expiry: Date;
  license_file: string;
}

export interface VehicleRecordResult {
  record_id: string;
  user_id: string;
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_capacity: number;
  registration_number: string;
  registration_expiry: Date;
  registration_file: string;
  insurance_expiry: Date;
  insurance_file: string;
  vehicle_image: string;
}

export interface ApplicationDetailsResult extends ApplicationResult {
  first_name?: string;
  last_name?: string;
  email_id?: string;
  driver_record?: DriverRecordResult;
  vehicle_record?: VehicleRecordResult;
}

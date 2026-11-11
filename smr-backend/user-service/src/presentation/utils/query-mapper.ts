import { UserEntity } from "#/domain/entities/UserEntity";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";

type RecordType<T> = Record<string, keyof T>;

const USER_FIELD_NAMES: RecordType<UserEntity> = {
  first_name: "firstName",
  last_name: "lastName",
  email_id: "emailId",
  user_id: "userId",
  phone_number: "phoneNumber",
  is_driver: "isDriver",
  created_at: "createdAt",
  profile_image: "profileImage",
  user_role: "userRole",
};

const VEHICLE_RECORD_FIELD_NAMES: RecordType<VehicleRecordEntity> = {
  record_id: "recordId",
  application_id: "applicationId",
  vehicle_type: "vehicleType",
  vehicle_make: "vehicleMake",
  vehicle_model: "vehicleModel",
  vehicle_capacity: "vehicleCapacity",
  registration_number: "registrationNumber",
  registration_expiry: "registrationExpiry",
  insurance_number: "insuranceNumber",
  insurance_expiry: "insuranceExpiry",
  created_at: "createdAt",
  updated_at: "updatedAt",
};

function mapQueryFields<T>(input: string, fieldNames: RecordType<T>): keyof T {
  return fieldNames[input] ?? (input as keyof T);
}

export function userQueryFieldMapper(fieldName: string): keyof UserEntity {
  return mapQueryFields<UserEntity>(fieldName, USER_FIELD_NAMES);
}

export function vehicleRecordQueryFieldMapper(
  fieldName: string,
): keyof VehicleRecordEntity {
  return mapQueryFields<VehicleRecordEntity>(
    fieldName,
    VEHICLE_RECORD_FIELD_NAMES,
  );
}

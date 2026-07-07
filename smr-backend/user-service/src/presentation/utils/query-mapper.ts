import { UserEntity } from "#/domain/entities/UserEntity";

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

function mapQueryFields<T>(input: string, fieldNames: RecordType<T>): keyof T {
  return fieldNames[input] ?? (input as keyof T);
}

export function userQueryFieldMapper(fieldName: string): keyof UserEntity {
  return mapQueryFields<UserEntity>(fieldName, USER_FIELD_NAMES);
}

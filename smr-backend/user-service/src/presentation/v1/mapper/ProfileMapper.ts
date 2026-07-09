import {
  GetUserResultDTO,
  UpdateUserRequestDTO,
} from "#/application/dto/profile/UserProfileDTO";
import {
  GetUserResult,
  UpdateUserRequest,
  UpdateUserSchema,
  zodParser,
} from "@smr/shared";

export function toGetUserResult(data: GetUserResultDTO): GetUserResult {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    user_id: data.userId,
    user_role: data.userRole,
    email_id: data.emailId,
    phone_number: data.phoneNumber,
    is_driver: data.isDriver,
    created_at: data.createdAt.toISOString(),
    profile_image: data.profileImage,
  };
}

export function toUpdateUserRequestDTO(data: unknown): UpdateUserRequestDTO {
  const validated = zodParser<UpdateUserRequest>(UpdateUserSchema, data);
  return {
    firstName: validated.first_name,
    lastName: validated.last_name,
    userId: validated.user_id,
    password: validated.password,
    profileImage: validated.profile_image,
    phoneNumber: validated.phone_number,
  };
}

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
    first_name: data.user.firstName,
    last_name: data.user.lastName,
    user_id: data.user.userId,
    user_role: data.user.userRole,
    email_id: data.user.emailId,
    phone_number: data.user.phoneNumber,
    is_driver: data.user.isDriver,
    created_at: data.user.createdAt.toISOString(),
    profile_image: data.user.profileImage,
  };
}

export function toUpdateUserRequestDTO(data: unknown): UpdateUserRequestDTO {
  const validated = zodParser<UpdateUserRequest>(UpdateUserSchema, data);
  return {
    firstName: validated.first_name,
    lastName: validated.last_name,
    emailId: validated.email_id,
    userId: validated.user_id,
    profileImage: validated.profile_image,
    phoneNumber: validated.phone_number,
  };
}

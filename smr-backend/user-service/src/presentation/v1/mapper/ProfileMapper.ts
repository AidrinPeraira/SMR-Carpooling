import {
  GetAvatarUploadUrlRequestDTO,
  GetAvatarUploadUrlResutlDTO,
  GetUserResultDTO,
  UpdateAvatarRequestDTO,
  UpdateAvatarResponseDTO,
  UpdateUserRequestDTO,
} from "#/application/dto/profile/UserProfileDTO";
import {
  GetAvatarUploadUrlRequest,
  GetAvatarUploadUrlResult,
  GetAvatarUploadUrlSchema,
  GetUserResult,
  UpdateAvatarRequest,
  UpdateAvatarResult,
  UpdateAvatarSchema,
  UpdateUserRequest,
  UpdateUserSchema,
  zodParser,
} from "@sharemyride/shared";

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

export function toGetAvatarUploadUrlRequestDTO(
  data: unknown,
  userId: string,
): GetAvatarUploadUrlRequestDTO {
  const validated = zodParser<GetAvatarUploadUrlRequest>(
    GetAvatarUploadUrlSchema,
    data,
  );
  return {
    userId,
    fileType: validated.file_type,
  };
}

export function toGetAvatarUploadUrlResult(
  data: GetAvatarUploadUrlResutlDTO,
): GetAvatarUploadUrlResult {
  return {
    url: data.url,
    expires_at: data.expiresAt.toISOString(),
  };
}

export function toUpdateAvatarRequestDTO(
  data: unknown,
  userId: string,
): UpdateAvatarRequestDTO {
  const validated = zodParser<UpdateAvatarRequest>(UpdateAvatarSchema, data);
  return {
    userId,
    profileImage: validated.profile_image,
  };
}

export function toUpdateAvatarResult(
  data: UpdateAvatarResponseDTO,
): UpdateAvatarResult {
  return {
    profile_image: data.profileImage,
  };
}


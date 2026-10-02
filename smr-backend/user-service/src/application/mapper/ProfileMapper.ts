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
  GetUserResult,
  UpdateAvatarRequest,
  UpdateAvatarResult,
  UpdateUserRequest,
} from "@sharemyride/shared";

export class ProfileMapper {
  static toGetUserResult(data: GetUserResultDTO): GetUserResult {
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

  static toUpdateUserRequestDTO(data: UpdateUserRequest): UpdateUserRequestDTO {
    return {
      firstName: data.first_name,
      lastName: data.last_name,
      userId: data.user_id,
      password: data.password,
      profileImage: data.profile_image,
      phoneNumber: data.phone_number,
    };
  }

  static toGetAvatarUploadUrlRequestDTO(
    data: GetAvatarUploadUrlRequest,
    userId: string,
  ): GetAvatarUploadUrlRequestDTO {
    return {
      userId,
      fileType: data.file_type,
    };
  }

  static toGetAvatarUploadUrlResult(
    data: GetAvatarUploadUrlResutlDTO,
  ): GetAvatarUploadUrlResult {
    return {
      url: data.url,
      expires_at: data.expiresAt.toISOString(),
    };
  }

  static toUpdateAvatarRequestDTO(
    data: UpdateAvatarRequest,
    userId: string,
  ): UpdateAvatarRequestDTO {
    return {
      userId,
      profileImage: data.profile_image,
    };
  }

  static toUpdateAvatarResult(
    data: UpdateAvatarResponseDTO,
  ): UpdateAvatarResult {
    return {
      profile_image: data.profileImage,
    };
  }
}

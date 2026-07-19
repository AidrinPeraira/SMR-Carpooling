import {
  GetAllUsersResponseDTO,
  GetFullUserProfileResponseDTO,
} from "#/application/dto/admin/users/AdminUsersDTO";
import { GetAllUsersResult, GetFullUserProfileResult } from "@smr/shared";

/**
 * This funciton takes the get user data form getALlusersUseCAse
 * and maps it into the Dto result shape for the client
 *
 * @param - DTO shape from useCase
 * @return Dto Shape for the client
 */
export function toGetAllUsersResult(
  data: GetAllUsersResponseDTO,
): GetAllUsersResult {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    user_id: data.userId,
    user_role: data.userRole,
    email_id: data.emailId,
    is_driver: data.isDriver,
    account_status: data.accountStatus,
    created_at: data.createdAt,
  };
}

/**
 * This function takes the response result form the
 * get full user profile use case
 *  and maps it into jthe result dto for the client
 *
 *  @param data : Full user profile DTO from useCase
 *  @return Full user profil DTO for client
 */
export function toGetFullUserProfileResult(
  data: GetFullUserProfileResponseDTO,
): GetFullUserProfileResult {
  return {
    user_id: data.userId,
    first_name: data.firstName,
    last_name: data.lastName,
    email_id: data.emailId,
    user_role: data.userRole,
    account_status: data.accountStatus,
    email_verified: data.emailVerified,
    is_driver: data.isDriver,
    phone_number: data.phoneNumber,
    profile_image: data.profileImage,
    created_at: data.createdAt,
  };
}

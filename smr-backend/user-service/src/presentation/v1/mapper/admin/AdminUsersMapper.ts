import { GetAllUsersResponseDTO } from "#/application/dto/admin/users/AdminUsersDTO";
import { GetAllUsersResult } from "@smr/shared";

export function toGetAllUsersResult(
  data: GetAllUsersResponseDTO,
): GetAllUsersResult {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    user_id: data.userId,
    user_role: data.userRole,
    email_id: data.emailId,
    phone_number: data.phoneNumber,
    is_driver: data.isDriver,
    account_status: data.accountStatus,
    created_at: data.createdAt,
    profile_image: data.profileImage,
  };
}

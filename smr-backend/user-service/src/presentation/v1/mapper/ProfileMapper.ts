import { GetUserResultDTO } from "#/application/dto/profile/GetUserDTO";
import { GetUserResult } from "@smr/shared";

export function toGetUserResult(data: GetUserResultDTO): GetUserResult {
  return {
    first_name: data.user.firstName,
    last_name: data.user.lastName,
    user_id: data.user.userId,
    user_role: data.user.userRole,
    email_id: data.user.emailId,
    profile_image: data.user.profileImage,
  };
}

import {
  GetAllUsersRequestQueryDTO,
  GetAllUsersResponseDTO,
  GetFullUserProfileResponseDTO,
} from "#/application/dto/admin/users/AdminUsersDTO";
import { userQueryFieldMapper } from "#/presentation/utils/query-mapper";
import {
  GetAllUsersResult,
  GetFullUserProfileResult,
  QueryRequest,
} from "@sharemyride/shared";

export class AdminUsersMapper {
  static toGetAllUsersRequestQuery(
    query: QueryRequest,
  ): GetAllUsersRequestQueryDTO {
    const { filterField, sortField, searchFields, ...rest } = query;

    return {
      ...rest,
      filterField: filterField ? userQueryFieldMapper(filterField) : undefined,
      sortField: sortField ? userQueryFieldMapper(sortField) : undefined,
      searchFields: searchFields
        ? searchFields.map((v) => userQueryFieldMapper(v))
        : undefined,
    };
  }

  static toGetAllUsersResult(
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

  static toGetFullUserProfileResult(
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
}

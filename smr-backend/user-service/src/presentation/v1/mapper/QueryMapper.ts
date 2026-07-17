import {
  GetAllUsersRequestQueryDTO,
  GetAllUsersResponseDTO,
} from "#/application/dto/admin/users/AdminUsersDTO";
import { userQueryFieldMapper } from "#/presentation/utils/query-mapper";
import { GetAllUsersResult, QuerySchema, zodParser } from "@smr/shared";

/**
 * This function takes an query object passed from request controller
 * It validates the fields and then maps the field names form the client shape
 * to the domain shape.
 *
 * @param query - query object from request controller
 * @returns Validated query object acceptable by domain.
 */
export function toGetAllUsersRequestQuery(
  query: unknown,
): GetAllUsersRequestQueryDTO {
  //we parse the schema
  const validatedQuery = zodParser<GetAllUsersRequestQueryDTO>(
    QuerySchema,
    query,
  );
  const { filterField, sortField, searchFields, ...rest } = validatedQuery;

  //then we map the valuse of the parsed fields
  return {
    ...rest,
    filterField: filterField ? userQueryFieldMapper(filterField) : undefined,
    sortField: sortField ? userQueryFieldMapper(sortField) : undefined,
    searchFields: searchFields
      ? searchFields.map((v) => userQueryFieldMapper(v))
      : undefined,
  };
}

/**
 * This function takes the response from use case result
 * and maps it into the the client side response shape
 *
 * @param data - User data from use case
 * @returns User data for client response
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
    account_status: data.accountStatus,
    phone_number: data.phoneNumber,
    is_driver: data.isDriver,
    created_at: data.createdAt,
    profile_image: data.profileImage,
  };
}

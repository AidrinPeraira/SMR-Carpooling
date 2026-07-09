import { GetAllUsersRequestQueryDTO } from "#/application/dto/admin/users/AdminUsersDTO";
import { userQueryFieldMapper } from "#/presentation/utils/query-mapper";
import { QuerySchema, zodParser } from "@smr/shared";

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

import {
  GetAllApplicationsQueryDTO,
  GetAllApplicationsResponseDTO,
} from "#/application/dto/admin/application/AdminApplicationsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This use case will list a paginated response of all applications
 * based on the query provided
 */
export interface IGetAllApplicationsUseCase {
  execute(
    query: GetAllApplicationsQueryDTO,
  ): Promise<PaginatedPayload<GetAllApplicationsResponseDTO[]>>;
}

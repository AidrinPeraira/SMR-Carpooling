import { GetApplicationsQueryRequest } from "#/application/dto/application/GetApplicationsQueryRequest";
import { GetApplicationsResultDTO } from "#/application/dto/application/GetApplicationsResultDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This user case gets all applications belongin to a user, using user id
 */
export interface IGetApplicationsUseCase {
  execute(
    userId: string,
    query: GetApplicationsQueryRequest,
  ): Promise<PaginatedPayload<GetApplicationsResultDTO[]>>;
}

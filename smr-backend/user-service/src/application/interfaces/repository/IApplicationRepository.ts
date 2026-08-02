import {
  GetAllApplicationsQueryDTO,
  GetAllApplicationsResponseDTO,
} from "#/application/dto/admin/application/AdminApplicationsDTO";
import { GetApplicationDetailsResultDTO } from "#/application/dto/application/GetApplicationDetailsResultDTO";
import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This is the repository for all applications (ApplicationEntities)
 */
export interface IApplicationRepository extends IBaseRepository<ApplicationEntity> {
  /**
   * This method queries applications and joins them with corresponding user data
   * from user table using aggregation / joins.
   *
   * @param query : Query fields for applications
   * @return Paginated applications list with pagination meta data
   */
  findApplications(
    query: GetAllApplicationsQueryDTO,
  ): Promise<PaginatedPayload<GetAllApplicationsResponseDTO>>;

  /**
   * this method finds the single application and aggregates / joins it with the
   * corresponding user detiald, dirver record and vehicle record collection
   *
   * @param applicationId : Id of the applicaiton to find
   * @return Full application details as DTO
   */
  getFullApplicationDetails(
    applicationId: string,
  ): Promise<GetApplicationDetailsResultDTO>;
}

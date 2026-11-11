import {
  GetAllApplicationsQueryDTO,
  GetAllApplicationsResponseDTO,
} from "#/application/dto/admin/application/AdminApplicationsDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IGetAllApplicationsUseCase } from "#/application/interfaces/use-case/admin/application/IGetAllApplicationsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This class is the implementation for the use case that gets
 * all applications and lists them for the admin
 */
export class GetAllApplicationsUseCase implements IGetAllApplicationsUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
  ) {}

  /**
   * This method takes the query details for fetching all applications and
   * queries the repository for matching applications.
   * It sends back a paginated response of selected applications
   *
   * @param query : Query request with query fields like search, filter and sort, with values.
   * @returns Paginated list applications with pagination meta data
   */
  async execute(
    query: GetAllApplicationsQueryDTO,
  ): Promise<PaginatedPayload<GetAllApplicationsResponseDTO[]>> {
    const searchFields: (keyof GetAllApplicationsResponseDTO)[] = [
      "firstName",
      "lastName",
      "emailId",
    ];

    const fullQuery = {
      ...query,
      searchFields,
    };

    const applications =
      await this._applicationRepository.findApplications(fullQuery);

    return applications;
  }
}

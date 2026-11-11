import { GetApplicationsResultDTO } from "#/application/dto/application/GetApplicationsResultDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IGetApplicationsUseCase } from "#/application/interfaces/use-case/application/IGetApplicationsUseCase";

/**
 * This is the implementation for the use case to get applications
 * that belong to a particular user
 */
export class GetApplicationsUseCase implements IGetApplicationsUseCase {
  constructor(
    private readonly _applicationRepository: IApplicationRepository,
  ) {}

  /**
   * This method finds all applications that belong to a user and
   * returns a list of application summaries that belong to that user
   *
   * @param userId Id of the user
   */
  async execute(userId: string, search?: string): Promise<GetApplicationsResultDTO[]> {
    const applications = await this._applicationRepository.find({
      filterField: "userId",
      filterValue: userId,
      search: search,
      searchFields: ["applicationId", "applicationType"],
      page: 1,
      limit: 100,
    });

    return applications.data.map((app) => ({
      applicationId: app.applicationId,
      applicationType: app.applicationType,
      applicationStatus: app.applicationStatus,
      createdAt: app.createdAt,
    }));
  }
}

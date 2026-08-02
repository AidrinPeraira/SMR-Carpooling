import { GetApplicationDetailsResultDTO } from "#/application/dto/application/GetApplicationDetailsResultDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IGetApplicationDetailsUseCase } from "#/application/interfaces/use-case/application/IGetApplicationDetailsUseCase";


/**
 * This is the implementation for the use case to get full application detials
 */
export class GetApplicationDetailsUseCase implements IGetApplicationDetailsUseCase {
  
  constructor(private readonly _applicationRepository : IApplicationRepository) {}


  /**
   * This method gets full details of application with aggreagated / joined vehicle record and driver record details
   *
   * @param application id
   * @returns full application detials
   */
  async execute(applicationId: string): Promise<GetApplicationDetailsResultDTO> {
    const application = await this._applicationRepository.getFullApplicationDetails(applicationId)
    return application;
  }
}

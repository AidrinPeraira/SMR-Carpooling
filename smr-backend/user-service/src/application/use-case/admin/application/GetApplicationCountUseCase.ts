import { GetApplicationCountResponseDTO } from "#/application/dto/admin/application/AdminApplicationsDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { IGetApplicationsCountUseCase } from "#/application/interfaces/use-case/admin/application/IGetApplicationCountUseCase";

export class GetApplicationCountUseCase implements IGetApplicationsCountUseCase {
  constructor(private readonly _applicationRepository: IApplicationRepository) {}

  async execute(): Promise<GetApplicationCountResponseDTO> {
    return this._applicationRepository.getApplicationCount();
  }
}

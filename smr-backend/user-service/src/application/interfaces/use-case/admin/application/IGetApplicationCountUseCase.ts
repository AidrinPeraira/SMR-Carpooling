import { GetApplicationCountResponseDTO } from "#/application/dto/admin/application/AdminApplicationsDTO";

export interface IGetApplicationsCountUseCase {
  execute(): Promise<GetApplicationCountResponseDTO>;
}

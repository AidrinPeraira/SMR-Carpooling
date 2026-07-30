import { GetConfigurationsResultDTO } from "#/application/dto/admin/ConfigurationDTO";

/**
 * This use case lists all availabel configs for admins
 */
export interface IGetConfigurationsUseCase {
  execute(): Promise<GetConfigurationsResultDTO>;
}

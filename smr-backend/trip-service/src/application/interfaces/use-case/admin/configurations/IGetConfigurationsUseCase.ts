import { GetConfigurationsResultDTO } from "#/application/dto/admin/ConfigurationDTO";
import { VehicleList } from "#/domain/entities/ConfigurationEntities";
import { QueryDTO } from "@sharemyride/shared";

/**
 * This use case lists all available configs for admins
 */
export interface IGetConfigurationsUseCase {
  execute(query?: QueryDTO<VehicleList>): Promise<GetConfigurationsResultDTO>;
}

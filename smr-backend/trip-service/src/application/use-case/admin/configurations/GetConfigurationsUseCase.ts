import { GetConfigurationsResultDTO } from "#/application/dto/admin/ConfigurationDTO";
import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { IGetConfigurationsUseCase } from "#/application/interfaces/use-case/admin/configurations/IGetConfigurationsUseCase";
import { VehicleList } from "#/domain/entities/ConfigurationEntities";
import { QueryDTO } from "@sharemyride/shared";

/**
 * This class implements the use case to get all configurations for the admin dash.
 */
export class GetConfigurationUseCase implements IGetConfigurationsUseCase {
  constructor(
    private readonly _vehicleRepository: IVehicleListRepository,
    private readonly _pricingRepository: IPricingRulesRepository,
    private readonly _configStore: IConfigurationStore,
  ) {}

  /**
   * This method finds the system configurations and returns
   * the mapped result as result DTO.
   *
   * @returns All available and configured settings in trip service
   */
  async execute(query?: QueryDTO<VehicleList>): Promise<GetConfigurationsResultDTO> {
    let pricing = await this._configStore.getPricingRules();
    if (!pricing) {
      pricing = await this._pricingRepository.findAll();

      if (pricing) await this._configStore.setPricingRules(pricing);
    }

    let vehicles: VehicleList[] | null = null;
    const hasQuery = query && (query.search || query.filterField || query.sortField);

    if (!hasQuery) {
      vehicles = await this._configStore.getVehicleList();
    }

    if (!vehicles) {
      vehicles = await this._vehicleRepository.findAll(query);
      if (vehicles && !hasQuery) await this._configStore.setVehicleList(vehicles);
    }

    return {
      pricingRules: pricing || [],
      vehicles: vehicles || [],
    };
  }
}

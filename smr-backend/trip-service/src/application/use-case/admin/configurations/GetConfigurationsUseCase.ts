import { GetConfigurationsResultDTO } from "#/application/dto/admin/ConfigurationDTO";
import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { IGetConfigurationsUseCase } from "#/application/interfaces/use-case/admin/configurations/IGetConfigurationsUseCase";

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
   * This method finds the system configurations and  returnsn
   * the mapped result as result DTO. It checks the redis cache first.
   * If not found checks db.
   *
   * @returns All available and configured settings in trip service
   */
  async execute(): Promise<GetConfigurationsResultDTO> {
    let pricing = await this._configStore.getPricingRules();
    if (!pricing) {
      pricing = await this._pricingRepository.findAll();

      if (pricing) await this._configStore.setPricingRules(pricing);
    }

    let vehicles = await this._configStore.getVehicleList();
    if (!vehicles) {
      vehicles = await this._vehicleRepository.findAll();
      if (vehicles) await this._configStore.setVehicleList(vehicles);
    }

    return {
      pricingRules: pricing || [],
      vehicles: vehicles || [],
    };
  }
}

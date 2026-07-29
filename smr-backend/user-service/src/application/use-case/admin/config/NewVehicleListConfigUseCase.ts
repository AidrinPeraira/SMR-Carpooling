import { NewVehicleConfigRequestDTO } from "#/application/dto/admin/config/VehicleListConfigDTOs";
import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListReposiory";
import { IAddNewVehicleListConfigUseCase } from "#/application/interfaces/use-case/admin/config/IAddNewVehicleListConfigUseCase";

export class NewVehicleListConfigUseCase
  implements IAddNewVehicleListConfigUseCase
{
  constructor(private readonly _vehicleListRepo: IVehicleListRepository) {}

  /**
   * This method takes the new vehicle details from the dto and creates a new entry in the repository.
   *
   * (It sets the id dto as the new custom vehicleId)
   * @param data New vehicle data payload from event from trip service
   */
  async execute(data: NewVehicleConfigRequestDTO): Promise<void> {
    await this._vehicleListRepo.save({
      vehicleId: data.id,
      vehicleType: data.vehicleType,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      isActive: data.isActive,
    });
  }
}

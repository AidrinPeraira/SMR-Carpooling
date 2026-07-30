import { UpdateVehicleConfigRequestDTO } from "#/application/dto/admin/config/VehicleListConfigDTOs";
import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListReposiory";
import { IUpdateVehicleConfigUseCase } from "#/application/interfaces/use-case/admin/config/IUpdateVehicleConfigListUseCase";
import { VehicleListEntity } from "#/domain/entities/VehicleListEntity";

export class UpdateVehicleListConfigUseCase
  implements IUpdateVehicleConfigUseCase
{
  constructor(private readonly _vehicleListRepo: IVehicleListRepository) {}

  /**
   * This method takes the data from the dto and updates the vehicle list config
   * with the updated data. The id from dto (event payload from trip service) is
   * used to match the custom id "vehicleId"
   *
   * @param data Updated data from event from trip service
   */
  async execute(data: UpdateVehicleConfigRequestDTO): Promise<void> {
    const updatePayload: Partial<VehicleListEntity> = {};

    if (data.vehicleType !== undefined) {
      updatePayload.vehicleType = data.vehicleType;
    }
    if (data.vehicleMake !== undefined) {
      updatePayload.vehicleMake = data.vehicleMake;
    }
    if (data.vehicleModel !== undefined) {
      updatePayload.vehicleModel = data.vehicleModel;
    }
    if (data.isActive !== undefined) {
      updatePayload.isActive = data.isActive;
    }

    await this._vehicleListRepo.updateByCustomId(data.id, updatePayload);
  }
}

import {
  UpdateVehicleRequestDTO,
  UpdateVehicleResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";

/**
 * This use case should update the existing vehicle in the trip config
 *  - It updates existing vehicle list
 *  - updates the in memory store with changed config
 */
export interface IUpdateVehicleUseCase {
  execute(data: UpdateVehicleRequestDTO): Promise<UpdateVehicleResultDTO>;
}

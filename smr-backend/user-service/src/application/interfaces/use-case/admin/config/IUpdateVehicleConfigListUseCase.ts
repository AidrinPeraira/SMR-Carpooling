import { UpdateVehicleConfigRequestDTO } from "#/application/dto/admin/config/VehicleListConfigDTOs";

/**
 * This use case finds the matching vehicle in vehicle config list repository
 * and updtes it with the new updated values
 */
export interface IUpdateVehicleConfigUseCase {
  execute(data: UpdateVehicleConfigRequestDTO): Promise<void>;
}

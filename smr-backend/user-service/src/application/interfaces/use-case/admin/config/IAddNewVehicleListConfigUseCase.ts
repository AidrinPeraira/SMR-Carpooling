import { NewVehicleConfigRequestDTO } from "#/application/dto/admin/config/VehicleListConfigDTOs";

/**
 * This use case creates a new entry in the vehicle list config db
 */
export interface IAddNewVehicleListConfigUseCase {
  execute(data: NewVehicleConfigRequestDTO): Promise<void>;
}

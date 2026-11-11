import { NewVehicleApplicationRequestDTO } from "#/application/dto/application/NewVehicleApplicationRequestDTO";

/**
 * This method creates a new application to approve and add a new vehicle for a driver
 */
export interface INewVehicleApplicationUseCase {
  execute(data: NewVehicleApplicationRequestDTO): Promise<void>;
}

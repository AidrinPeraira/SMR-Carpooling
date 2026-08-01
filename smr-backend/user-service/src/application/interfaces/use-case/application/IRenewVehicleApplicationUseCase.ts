import { RenewVehicleApplicationRequestDTO } from "#/application/dto/application/RenewVehicleApplicationRequestDTO";

/**
 * This use case is going to create a new application and vehicel record
 * It brings over valid data from existing record data
 */
export interface IRenewVehicleApplicationUseCase {
  execute(data: RenewVehicleApplicationRequestDTO): Promise<void>;
}

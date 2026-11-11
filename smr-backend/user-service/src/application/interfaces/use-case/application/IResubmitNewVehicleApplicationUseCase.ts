import { ResubmitNewVehicleApplicationRequestDTO } from "#/application/dto/application/ResubmitNewVehicleApplicationRequestDTO";

/**
 * This use case resubmits a returned new vehicle application and updates the vehicle record
 */
export interface IResubmitNewVehicleApplicationUseCase {
  execute(data: ResubmitNewVehicleApplicationRequestDTO): Promise<void>;
}

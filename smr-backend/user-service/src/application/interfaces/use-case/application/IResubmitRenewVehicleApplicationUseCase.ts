import { ResubmitRenewVehicleApplicationRequestDTO } from "#/application/dto/application/ResubmitRenewVehicleApplicationRequestDTO";

/**
 * This use case resubmits a returned vehicle renewal application and updates the vehicle record
 */
export interface IResubmitRenewVehicleApplicationUseCase {
  execute(data: ResubmitRenewVehicleApplicationRequestDTO): Promise<void>;
}

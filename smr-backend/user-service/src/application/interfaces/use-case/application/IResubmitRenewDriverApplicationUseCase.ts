import { ResubmitRenewDriverApplicationRequestDTO } from "#/application/dto/application/ResubmitRenewDriverApplicationRequestDTO";

/**
 * This use case resubmits a returned driver renewal application and updates the driver record
 */
export interface IResubmitRenewDriverApplicationUseCase {
  execute(data: ResubmitRenewDriverApplicationRequestDTO): Promise<void>;
}

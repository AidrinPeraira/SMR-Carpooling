import { RenewDriverApplicationRequsetDTO } from "#/application/dto/application/RenewDriverApplicationRequestDTO";

/**
 * This use case creates a new application to renew expired driver records
 */
export interface IRenewDriverApplicationUseCase {
  execute(data: RenewDriverApplicationRequsetDTO): Promise<void>;
}

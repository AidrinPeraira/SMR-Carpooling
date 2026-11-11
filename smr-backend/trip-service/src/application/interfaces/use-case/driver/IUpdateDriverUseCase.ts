import { UpdateDriverRequestDTO } from "#/application/dto/driver/UpdateDriverRequestDTO";

/**
 * This use case updates the existing driver to point to the
 * new approved record
 */
export interface IUpdateDriverUseCase {
  execute(data: UpdateDriverRequestDTO): Promise<void>;
}

import { AcceptCallRequestDTO } from "#/application/dto/CallDTO";

/**
 * This use case accpts and connects calls
 *
 */
export interface IAcceptCallUseCase {
  execute(dto: AcceptCallRequestDTO): Promise<void>;
}

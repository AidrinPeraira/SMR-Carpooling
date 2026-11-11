import { AcceptCallRequestDTO } from "#/application/dto/CallDTO";

/**
 * This use case handles accepting a call by the receiver
 */
export interface IAcceptCallUseCase {
  execute(dto: AcceptCallRequestDTO): Promise<void>;
}

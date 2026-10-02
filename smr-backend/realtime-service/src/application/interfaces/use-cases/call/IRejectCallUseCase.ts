import { RejectCallRequestDTO } from "#/application/dto/CallDTO";

/**
 * This use case handles a receiver rejecting an
 * incomming call. The rejection is relayed to the caller
 */
export interface IRejectCallUseCase {
  execute(dto: RejectCallRequestDTO): Promise<void>;
}

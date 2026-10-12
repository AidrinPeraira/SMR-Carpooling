import { RelayCallSignalRequestDTO } from "#/application/dto/CallDTO";

/**
 * This use case handles exchanging ICE Signal (Interactive comunication establishment)
 * between the caller and receiver. It exchanges the credentials
 */
export interface IRelayCallSignalUseCase {
  execute(dto: RelayCallSignalRequestDTO): Promise<void>;
}

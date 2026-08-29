import { RelayCallSignalRequestDTO } from "#/application/dto/CallDTO";

export interface IRelayCallSignalUseCase {
  execute(dto: RelayCallSignalRequestDTO): Promise<void>;
}

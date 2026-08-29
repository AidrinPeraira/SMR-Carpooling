import { InitiateCallRequestDTO } from "#/application/dto/CallDTO";

/**
 * This use case handles check for active trips in member record
 * of caller and checks if reciever is also in the active trip and
 * initates a call if valid after creating a new call session
 */
export interface IInitiateCallUseCase {
  execute(dto: InitiateCallRequestDTO): Promise<void>;
}

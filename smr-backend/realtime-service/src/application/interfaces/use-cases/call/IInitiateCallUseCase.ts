import { InitiateCallRequestDTO } from "#/application/dto/CallDTO";

/**
 * This use case checks the details for being valid
 * against the member repository and its active trips
 * and then initiates the call alert only if valid
 */
export interface IInitiateCallUseCase {
  execute(dto: InitiateCallRequestDTO): Promise<void>;
}

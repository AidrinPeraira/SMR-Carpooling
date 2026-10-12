import { LeaveTripChatRequestDTO } from "#/application/dto/ChatDTO";

/**
 * This use case removes the active conneciton
 * of the user with the trip chat
 */
export interface ILeaveTripChatUseCase {
  execute(dto: LeaveTripChatRequestDTO, socketId: string): Promise<void>;
}

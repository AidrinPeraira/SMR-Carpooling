import { JoinTripChatRequestDTO } from "#/application/dto/ChatDTO";

/**
 * This use case verifies the user id and trip id
 * agains the existing chat and memeber records and
 * allows the user to join a chat room if valid
 */
export interface IJoinTripChatUseCase {
  execute(dto: JoinTripChatRequestDTO, socketId: string): Promise<void>;
}

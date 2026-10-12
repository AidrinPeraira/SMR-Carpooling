import { SendMessageRequestDTO } from "#/application/dto/ChatDTO";

/**
 * This use case handles sending messages to
 * a trip chat.
 */
export interface ISendMessageUseCase {
  execute(dto: SendMessageRequestDTO): Promise<void>;
}

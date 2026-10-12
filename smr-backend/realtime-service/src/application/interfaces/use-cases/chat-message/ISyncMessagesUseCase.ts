import {
  SyncChatMessagesRequestDTO,
  SyncChatMessagesResponseDTO,
} from "#/application/dto/ChatDTO";

export interface ISyncMessagesUseCase {
  execute(
    dto: SyncChatMessagesRequestDTO,
  ): Promise<SyncChatMessagesResponseDTO>;
}

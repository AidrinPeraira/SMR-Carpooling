/**
 * This use case ends the chat life
 * by deactivating it
 */
export interface ICloseChatUseCase {
  execute(tripId: string): Promise<void>;
}

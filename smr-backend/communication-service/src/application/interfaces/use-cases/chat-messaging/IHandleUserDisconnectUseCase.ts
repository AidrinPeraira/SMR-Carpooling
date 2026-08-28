export interface IHandleUserDisconnectUseCase {
  execute(userId: string): Promise<void>;
}

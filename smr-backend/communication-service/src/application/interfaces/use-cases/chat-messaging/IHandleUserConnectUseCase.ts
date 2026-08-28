export interface IHandleUserConnectUseCase {
  execute(userId: string): Promise<void>;
}

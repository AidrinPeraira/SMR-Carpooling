export interface IRelayCallSignalUseCase {
  execute(userId: string): Promise<void>;
}

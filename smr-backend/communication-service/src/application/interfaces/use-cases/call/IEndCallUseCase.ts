export interface IEndCallUseCase {
  execute(callSessionId: string): Promise<void>;
}

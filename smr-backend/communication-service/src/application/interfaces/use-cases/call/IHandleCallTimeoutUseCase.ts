export interface IHandleCallTimeoutUseCase {
  execute(callSessionId: string): Promise<void>;
}

import { IRelayCallSignalUseCase } from "#/application/interfaces/use-cases/call/IRelayCallSignalUseCase";

export class RelayCallSignalUseCase implements IRelayCallSignalUseCase {
  constructor() {}

  async execute(userId: string): Promise<void> {
    // Stubbed WebRTC signal relay implementation as requested.
    // In the future, this will handle WebRTC ICE candidates and SDP offers/answers.
    console.log(`Relay call signal for user ${userId} - Not Implemented Yet (Stubbed)`);
  }
}

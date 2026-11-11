/**
 * This use case confirms trip completion for the driver,
 * it verifies that all passengers have been dropped off
 * and publishes event to create a driver payout and clear
 * journey live tracking
 */
export interface IDriverCompleteJourneyUseCase {
  execute(journeyId: string, driverId: string): Promise<void>;
}

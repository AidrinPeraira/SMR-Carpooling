import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, NewBookingEvent } from "@sharemyride/shared";
import { IAddActiveTripUseCase } from "#/application/interfaces/use-cases/members/IAddActiveTripUseCase";
import { IAddChatMembersUseCase } from "#/application/interfaces/use-cases/chat/IAddChatMembersUseCase";

/**
 * This class implements the event handler that
 * handles new booking events to add the trip id
 * to the active trips of the passenger and driver.
 */
export class NewBookingEventHandler implements IEventHandler<NewBookingEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _addActiveTripUseCase: IAddActiveTripUseCase,
    private readonly _addChatMembersUseCase: IAddChatMembersUseCase,
  ) {}

  async handle(event: NewBookingEvent): Promise<void> {
    try {
      this._logger.info("Handling new booking event in communication service", {
        bookingId: event.payload.bookingId,
      });

      // Add to passenger
      await this._addActiveTripUseCase.execute({
        userId: event.payload.passengerId,
        tripId: event.payload.tripId,
      });

      // Add to chat
      await this._addChatMembersUseCase.execute(event.payload.tripId, event.payload.passengerId);

      this._logger.info("Successfully added active trips from new booking event");
    } catch (error: unknown) {
      this._logger.error("Failed to handle new booking event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

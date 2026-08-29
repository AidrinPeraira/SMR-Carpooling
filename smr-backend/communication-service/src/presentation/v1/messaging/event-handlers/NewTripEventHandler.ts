import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, NewTripEvent } from "@sharemyride/shared";
import { IAddActiveTripUseCase } from "#/application/interfaces/use-cases/members/IAddActiveTripUseCase";
import { ICreateNewChatUseCase } from "#/application/interfaces/use-cases/chat/ICreateNewChatUseCase";
import { IAddChatMembersUseCase } from "#/application/interfaces/use-cases/chat/IAddChatMembersUseCase";

/**
 * This class implements the event handler that
 * handles new trip events to add the trip id
 * to the active trips of the driver, and initialize the chat.
 */
export class NewTripEventHandler implements IEventHandler<NewTripEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _addActiveTripUseCase: IAddActiveTripUseCase,
    private readonly _createNewChatUseCase: ICreateNewChatUseCase,
    private readonly _addChatMembersUseCase: IAddChatMembersUseCase,
  ) {}

  async handle(event: NewTripEvent): Promise<void> {
    try {
      this._logger.info("Handling new trip event in communication service", {
        tripId: event.payload.tripId,
      });

      // Add to driver
      await this._addActiveTripUseCase.execute({
        userId: event.payload.driverId,
        tripId: event.payload.tripId,
      });

      // Initialize chat and add driver
      await this._createNewChatUseCase.execute(event.payload.tripId);
      await this._addChatMembersUseCase.execute(event.payload.tripId, event.payload.driverId);

      this._logger.info("Successfully added active trip for driver and initialized chat from new trip event");
    } catch (error: unknown) {
      this._logger.error("Failed to handle new trip event", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

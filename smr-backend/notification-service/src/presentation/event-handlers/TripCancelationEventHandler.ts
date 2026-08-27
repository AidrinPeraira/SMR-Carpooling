import { TripCancellationMailDTO } from "#/application/dto/email/TripCancellationMailDTO";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ISendTripCancellationEmailUseCase } from "#/application/interfaces/use-case/ISendTripCancellationEmail";
import { DriverCancelTripEvent, ILogger } from "@sharemyride/shared";

export class TripCancellationEventHandler
  implements IEventHandler<DriverCancelTripEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendTripCancellationEmailUseCase: ISendTripCancellationEmailUseCase,
  ) {}

  async handle(event: DriverCancelTripEvent): Promise<void> {
    const dto: TripCancellationMailDTO = {
      tripId: event.payload.tripId,
      driverName: event.payload.dirverName, // Mapping typo in shared package
      driverEmail: event.payload.driverEmail,
      cancelledBookings: event.payload.cancelledBookings.map((b) => ({
        bookingId: b.bookingId,
        passengerName: b.passengerName,
        passengerEmail: b.passengerEmail,
      })),
    };

    this._logger.info("Handling trip cancellation event for trip:", {
      tripId: dto.tripId,
      driverEmail: dto.driverEmail,
      cancelledBookingsCount: dto.cancelledBookings.length,
    });

    await this._sendTripCancellationEmailUseCase.execute(dto);
  }
}

import { Request, Response, NextFunction } from "express";
import { ICleanUpBookingPaymentUseCase } from "#/application/interfaces/use-case/booking/ICleanUpBookingPaymentUseCase";
import { ICleanUpTripsIndexingUseCase } from "#/application/interfaces/use-case/trip/ICleanUpTripsIndexingUseCase";
import { IWebhookControllerV1 } from "#/presentation/v1/interfaces/IWebhookControllerV1";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@sharemyride/shared";

export class WebhookControllerV1 implements IWebhookControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _cleanUpBookingPaymentUseCase: ICleanUpBookingPaymentUseCase,
    private readonly _cleanUpTripsIndexingUseCase: ICleanUpTripsIndexingUseCase,
  ) {}

  async cleanupBookingPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        bookingId,
        booking_id,
        tripId,
        trip_id,
        paymentKey,
        payment_key,
      } = req.body || {};

      const resolvedBookingId = (bookingId || booking_id) as string;
      const resolvedTripId = (tripId || trip_id) as string;
      const resolvedPaymentKey = (paymentKey || payment_key) as string;

      this._logger.info("Handling webhook: cleanup booking payment", {
        bookingId: resolvedBookingId,
        tripId: resolvedTripId,
      });

      await this._cleanUpBookingPaymentUseCase.execute({
        bookingId: resolvedBookingId,
        tripId: resolvedTripId,
        paymentKey: resolvedPaymentKey,
      });

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Booking payment cleanup executed successfully",
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async cleanupTrips(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      this._logger.info("Handling webhook: cleanup trips indexing");

      await this._cleanUpTripsIndexingUseCase.execute();

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Trips indexing cleanup executed successfully",
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}

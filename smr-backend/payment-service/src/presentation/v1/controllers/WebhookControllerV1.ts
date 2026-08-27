import { IFailedBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IFailedBookingPaymentUseCase";
import { IWebhookControllerV1 } from "#/presentation/v1/interfaces/IWebhookControllerV1";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@sharemyride/shared";
import { Request, Response } from "express";

export class WebhookControllerV1 implements IWebhookControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _failedBookingPaymentUseCase: IFailedBookingPaymentUseCase,
  ) {}

  async clearBookingPayment(req: Request, res: Response): Promise<void> {
    const { bookingPaymentID } = req.body;
    const resolvedBookingPaymentId = bookingPaymentID as string;

    this._logger.info("Handling webhook: clear booking payment", {
      bookingPaymentId: resolvedBookingPaymentId,
    });

    await this._failedBookingPaymentUseCase.execute({ bookingPaymentID });

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          "Booking payment cleanup executed successfully",
          null,
        ),
      );
  }
}

import { ICreateBookingPaymentOrderUseCase } from "#/application/interfaces/use-cases/payment/ICreateBookingPaymentOrderUseCase";
import { IVerifyBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IVerifyBookingPaymentUseCase";
import { IPayBookingWithWalletUseCase } from "#/application/interfaces/use-cases/payment/IPayBookingWithWalletUseCase";
import { IPaymentControllerV1 } from "#/presentation/v1/interfaces/IPaymentControllerV1";
import { PaymentMapper } from "#/presentation/v1/mapper/PaymentMapper";
import {
  CreateBookingPaymentOrderRequest,
  CreateBookingPaymentOrderResult,
  CreateBookingPaymentOrderSchema,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  PaymentSuccessMessage,
  VerifyBookingPaymentOrderRequest,
  VerifyBookingPaymentOrderSchema,
  PayBookingWithWalletRequest,
  PayBookingWithWalletSchema,
  zodParser,
} from "@sharemyride/shared";
import { Request, Response } from "express";

export class PaymentControllerV1 implements IPaymentControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _createBookingPaymentOrderUseCase: ICreateBookingPaymentOrderUseCase,
    private readonly _verifyBookingPaymentUseCase: IVerifyBookingPaymentUseCase,
    private readonly _payBookingWithWalletUseCase: IPayBookingWithWalletUseCase,
  ) {}

  async createBookingPaymentOrder(req: Request, res: Response): Promise<void> {
    const body = zodParser<CreateBookingPaymentOrderRequest>(
      CreateBookingPaymentOrderSchema,
      req.body,
    );
    const dto = PaymentMapper.toCreateBookingPaymentOrderDTO(body);

    this._logger.info("Creating booking payment order");

    const result = await this._createBookingPaymentOrderUseCase.execute(dto);

    this._logger.info("Booking payment order created successfully", {
      orderNumber: result.orderNumber,
    });

    res
      .status(HttpStatusCodes.Created)
      .json(
        makeSuccessResponse<CreateBookingPaymentOrderResult>(
          PaymentSuccessMessage.ORDER_CREATED,
          PaymentMapper.toCreateBookingPaymentOrderResult(result),
        ),
      );
  }

  async verifyBookingPayment(req: Request, res: Response): Promise<void> {
    const body = zodParser<VerifyBookingPaymentOrderRequest>(
      VerifyBookingPaymentOrderSchema,
      req.body,
    );
    const dto = PaymentMapper.toVerifyBookingPaymentOrderDTO(body);

    this._logger.info("Verifying booking payment", {
      orderNumber: dto.orderNumber,
      paymentId: dto.paymentId,
    });

    await this._verifyBookingPaymentUseCase.execute(dto);

    this._logger.info("Booking payment verified successfully", {
      orderNumber: dto.orderNumber,
    });

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(PaymentSuccessMessage.PAYMENT_VERIFIED));
  }

  async payBookingWithWallet(req: Request, res: Response): Promise<void> {
    const body = zodParser<PayBookingWithWalletRequest>(
      PayBookingWithWalletSchema,
      req.body,
    );
    const dto = PaymentMapper.toPayBookingWithWalletDTO(body);

    this._logger.info("Processing wallet payment for booking");

    await this._payBookingWithWalletUseCase.execute(dto);

    this._logger.info("Booking wallet payment completed successfully");

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(PaymentSuccessMessage.PAYMENT_COMPLETED));
  }
}

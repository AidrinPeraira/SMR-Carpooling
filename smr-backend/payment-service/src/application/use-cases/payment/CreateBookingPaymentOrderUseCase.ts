import { AppConfig } from "#/application.config";
import {
  CreateBookingPaymentOrderRequestDTO,
  CreateBookingPaymentOrderResponseDTO,
} from "#/application/dto/payments/BookingPaymentDTO";
import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { IPaymentProvider } from "#/application/interfaces/services/IPaymentProvider";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { ICreateBookingPaymentOrderUseCase } from "#/application/interfaces/use-cases/payment/ICreateBookingPaymentOrderUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PaymentErrorMessage,
  PaymentMethod,
  PaymentTokenPayload,
  TransactionStatus,
} from "@sharemyride/shared";

/**
 * This class implements the use case to create a booking payment record for the given booking
 * and also create an order with the payment service provider to return to the client
 */
export class CreateBookingPaymentOrderUseCase implements ICreateBookingPaymentOrderUseCase {
  constructor(
    private readonly _bookingPaymentRepository: IBookingPaymentRepository,
    private readonly _tokenService: ITokenService,
    private readonly _paymentProvider: IPaymentProvider,
  ) {}

  /**
   * This method verifies the payment token and creates a payment record
   * after generating order with payment service provider.
   * Ensures idempotency using paymentKey and validates key expiry.
   *
   *  @param  dto : dto with payment token
   *  @returns order details from payment provider
   */
  async execute(
    dto: CreateBookingPaymentOrderRequestDTO,
  ): Promise<CreateBookingPaymentOrderResponseDTO> {
    // 1. Verify payment token
    let payload: PaymentTokenPayload;
    try {
      payload = this._tokenService.verifyToken<PaymentTokenPayload>(
        dto.paymentToken,
        AppConfig.PAYMENT_SECRET,
      );
    } catch (err) {
      throw new ApplicationError(
        PaymentErrorMessage.INVALID_PAYMENT_TOKEN,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_TOKEN_EXPIRED,
        ErrorDetails.INPUT_TOKEN_EXPIRED,
        {
          location: "CreateBookingPaymentOrderUseCase - verifyToken",
          cause: err,
        },
      );
    }

    const { bookingId, passengerId, paymentKey, ammount, expiresAt } =
      payload.paymentDetails;
    const amount = ammount;

    const expiryTimestamp = expiresAt
      ? new Date(expiresAt).getTime()
      : payload.exp
        ? payload.exp
        : 0;

    const isExpired = expiryTimestamp > 0 && Date.now() > expiryTimestamp;

    // 2. Check for existing payment record using paymentKey for idempotency
    const existingPayment = await this._bookingPaymentRepository.findByPaymentKey(
      paymentKey,
    );

    if (existingPayment) {
      if (isExpired) {
        if (existingPayment.status !== TransactionStatus.CANCELLED) {
          await this._bookingPaymentRepository.updateById(existingPayment.id, {
            status: TransactionStatus.CANCELLED,
            updatedAt: new Date(),
          });
        }

        throw new ApplicationError(
          PaymentErrorMessage.PAYMENT_WINDOW_EXPIRED,
          HttpStatusCodes.BadRequest,
          ErrorCode.INPUT_TOKEN_EXPIRED,
          ErrorDetails.INPUT_TOKEN_EXPIRED,
          {
            location: "CreateBookingPaymentOrderUseCase - expired key",
            description: "The payment window for this booking has expired",
          },
        );
      }

      if (existingPayment.gatewayOrderId) {
        return {
          orderNumber: existingPayment.gatewayOrderId,
        };
      }
    }

    if (isExpired) {
      throw new ApplicationError(
        PaymentErrorMessage.PAYMENT_WINDOW_EXPIRED,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_TOKEN_EXPIRED,
        ErrorDetails.INPUT_TOKEN_EXPIRED,
        {
          location: "CreateBookingPaymentOrderUseCase - expired key",
          description: "The payment window for this booking has expired",
        },
      );
    }

    // 3. Save or use existing pending payment entity
    const bookingPayment =
      existingPayment ??
      (await this._bookingPaymentRepository.save({
        bookingId,
        passengerId,
        amount,
        paymentKey,
        paymentMethod: PaymentMethod.PAYMENT_GATEWAY,
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    // 4. Create order with payment provider
    const providerOrder = await this._paymentProvider.createOrder(
      amount,
      bookingPayment.id,
    );

    // 5. Store gatewayOrderId
    await this._bookingPaymentRepository.updateById(bookingPayment.id, {
      gatewayOrderId: providerOrder.orderId,
      updatedAt: new Date(),
    });

    return {
      orderNumber: providerOrder.orderId,
    };
  }
}

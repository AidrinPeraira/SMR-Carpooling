import { AppConfig } from "#/application.config";
import {
  CreateBookingPaymentOrderRequestDTO,
  CreateBookingPaymentOrderResponseDTO,
  FailedBookingPaymentRequestDTO,
} from "#/application/dto/payments/BookingPaymentDTO";
import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IPaymentProvider } from "#/application/interfaces/services/IPaymentProvider";
import { ISchedulerService } from "#/application/interfaces/services/ISchedulerService";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { ICreateBookingPaymentOrderUseCase } from "#/application/interfaces/use-cases/payment/ICreateBookingPaymentOrderUseCase";
import {
  ApplicationError,
  BookingPaymentFailureEvent,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  PaymentErrorMessage,
  PaymentMethod,
  PaymentTokenPayload,
  ScheduledJOB,
  TransactionStatus,
  UserErrorMessage,
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
    private readonly _schedulerService: ISchedulerService,
    private readonly _cleanupWebhookUrl: string,
    private readonly _customerRepository: ICustomerRepository,
    private readonly _eventBus: IEventBus,
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
    let passengerId: string | undefined;
    let bookingId: string | undefined;
    let paymentKey: string | undefined;

    try {
      //verify token and get payload
      let payload: PaymentTokenPayload;
      try {
        payload = this._tokenService.verifyToken<PaymentTokenPayload>(
          dto.paymentToken,
          AppConfig.PAYMENT_SECRET,
        );
      } catch {
        throw new ApplicationError(
          PaymentErrorMessage.INVALID_PAYMENT_TOKEN,
          HttpStatusCodes.BadRequest,
          ErrorCode.INPUT_TOKEN_EXPIRED,
          ErrorDetails.INPUT_TOKEN_EXPIRED,
          {
            location: "CreateBookingPaymentOrderUseCase",
            description: "Token verification failed",
          },
        );
      }

      passengerId = payload.paymentDetails.passengerId;
      bookingId = payload.paymentDetails.bookingId;
      paymentKey = payload.paymentDetails.paymentKey;
      const amount = payload.paymentDetails.ammount;
      const expiresAt = payload.paymentDetails.expiresAt;

      const expiryTimestamp = expiresAt
        ? new Date(expiresAt).getTime()
        : payload.exp
          ? payload.exp
          : 0;
      const isExpired = expiryTimestamp > 0 && Date.now() > expiryTimestamp;

      const customer = await this._customerRepository.findByCustomerId(passengerId);
      if (!customer) {
        throw new ApplicationError(
          UserErrorMessage.NOT_FOUND,
          HttpStatusCodes.NotFound,
          ErrorCode.DOMAIN_NOT_FOUND,
          ErrorDetails.DOMAIN_NOT_FOUND,
          {
            location: "CreateBookingPaymentOrderUseCase",
            description: `No user found with the provided passengerId: ${passengerId}`,
          },
        );
      }

      //check for already paid
      const successfulBooking =
        await this._bookingPaymentRepository.findSuccesfulBookingById(
          bookingId,
        );
      if (successfulBooking) {
        throw new ApplicationError(
          PaymentErrorMessage.PAYMENT_ALREADY_COMPLETED,
          HttpStatusCodes.Conflict,
          ErrorCode.DOMAIN_CONFLICT,
          ErrorDetails.DOMAIN_CONFLICT,
          {
            location: "CreateBookingPaymentOrderUseCase",
            description: "The payment for this booking has been done",
          },
        );
      }

      //check existing record for idempotency
      const existingPayment =
        await this._bookingPaymentRepository.findByPaymentKey(paymentKey);

      if (existingPayment) {
        if (isExpired) {
          if (existingPayment.status !== TransactionStatus.CANCELLED) {
            await this._bookingPaymentRepository.updateById(
              existingPayment.id,
              {
                status: TransactionStatus.CANCELLED,
                updatedAt: new Date(),
              },
            );
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
        if (existingPayment.status === TransactionStatus.CANCELLED) {
          throw new ApplicationError(
            PaymentErrorMessage.PAYMENT_CANCELLED,
            HttpStatusCodes.BadRequest,
            ErrorCode.DOMAIN_CONFLICT,
            ErrorDetails.DOMAIN_CONFLICT,
            {
              location: "CreateBookingPaymentOrderUseCase",
              description: "Payment has already been cancelled",
            },
          );
        }

        //if previous valid order is present and it is pending
        //make payment to that order number
        if (existingPayment.gatewayOrderId && existingPayment.status === TransactionStatus.PENDING) {
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

      //new booking payment. (we have to do this to get bookingPayment record id)
      //we create a new booking payment. (keep old one for record)
      // Note: This creates a new record even if a FAILED one exists.
      const bookingPayment = await this._bookingPaymentRepository.save({
        bookingId,
        passengerId,
        amount,
        paymentKey,
        paymentMethod: PaymentMethod.PAYMENT_GATEWAY,
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      //publish a celanup job
      const cleanupJob: ScheduledJOB<FailedBookingPaymentRequestDTO> = {
        webhookUrl: this._cleanupWebhookUrl,
        body: {
          bookingPaymentID: bookingPayment.id,
        },
        retries: 3,
        delaySeconds: 2 * 60,
      };
      await this._schedulerService.scheduleJob<FailedBookingPaymentRequestDTO>(
        cleanupJob,
      );

      //create new order to process the new payment
      const providerOrder = await this._paymentProvider.createOrder(
        amount,
        bookingPayment.id,
      );

      //update
      await this._bookingPaymentRepository.updateById(bookingPayment.id, {
        gatewayOrderId: providerOrder.orderId,
        updatedAt: new Date(),
      });

      return {
        orderNumber: providerOrder.orderId,
      };
    } catch (error) {
      if (passengerId && bookingId && paymentKey) {
        // Do not publish failure event if it's already completed.
        const isConflict = error instanceof ApplicationError && error.errorCode === ErrorCode.DOMAIN_CONFLICT;
        
        if (!isConflict) {
          const customer = await this._customerRepository.findByCustomerId(passengerId);
          const firstName = customer?.firstName ?? "";
          const lastName = customer?.lastName ?? "";
          const emailId = customer?.emailId ?? "";

          const failureEvent: BookingPaymentFailureEvent = {
            eventName: EventName.BOOKING_PAYMENT_FAILURE,
            timestamp: new Date(),
            payload: {
              passengerId,
              firstName,
              lastName,
              emailId,
              bookingId,
              paymentKey,
            },
          };

          await this._eventBus.publish(failureEvent);
        }
      }

      throw error;
    }
  }
}

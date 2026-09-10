import { PayBookingWithWalletRequestDTO } from "#/application/dto/payments/BookingPaymentDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { IWalletRepository } from "#/application/interfaces/repository/IWalletRepository";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { IPayBookingWithWalletUseCase } from "#/application/interfaces/use-cases/payment/IPayBookingWithWalletUseCase";
import { AppConfig } from "#/application.config";
import {
  ApplicationError,
  BookingPaymentFailureEvent,
  BookingPaymentSuccessEvent,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  PaymentErrorMessage,
  PaymentMethod,
  PaymentTokenPayload,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  UserErrorMessage,
} from "@sharemyride/shared";
import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";

/**
 * This class implements the use case to handle
 * booking payments using the customer wallet.
 * It also handles publishing the necessary success and failure
 * events
 */
export class PayBookingWithWalletUseCase implements IPayBookingWithWalletUseCase {
  constructor(
    private readonly _tokenService: ITokenService,
    private readonly _bookingPaymentRepository: IBookingPaymentRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _eventBus: IEventBus,
    private readonly _uidService: IUniqueIdGenerator,
    private readonly _customerRepository: ICustomerRepository,
  ) {}

  /**
   * Validates the payment token, checks wallet balance, and deducts the amount synchronously.
   * Updates relevant repositories and publishes a success or failure event.
   *
   * @param dto - Contains the payment token.
   */
  async execute(dto: PayBookingWithWalletRequestDTO): Promise<void> {
    let passengerId: string | undefined;
    let bookingId: string | undefined;
    let paymentKey: string | undefined;

    try {
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
            location: "PayBookingWithWalletUseCase",
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
            location: "PayBookingWithWalletUseCase",
            description: `No user found with the provided passengerId: ${passengerId}`,
          },
        );
      }

      const existingPayment =
        await this._bookingPaymentRepository.findByPaymentKey(paymentKey);

      if (existingPayment) {
        if (existingPayment.status === TransactionStatus.SUCCESS) {
          return;
        }

        if (
          isExpired &&
          existingPayment.status !== TransactionStatus.CANCELLED
        ) {
          await this._bookingPaymentRepository.updateById(existingPayment.id, {
            status: TransactionStatus.CANCELLED,
            updatedAt: new Date(),
          });
          throw new ApplicationError(
            PaymentErrorMessage.PAYMENT_WINDOW_EXPIRED,
            HttpStatusCodes.BadRequest,
            ErrorCode.INPUT_TOKEN_EXPIRED,
            ErrorDetails.INPUT_TOKEN_EXPIRED,
            {
              location: "PayBookingWithWalletUseCase",
              description: "The payment window for this booking has expired",
            },
          );
        }

        if (existingPayment.status === TransactionStatus.PENDING) {
          throw new ApplicationError(
            PaymentErrorMessage.PAYMENT_ALREADY_INITIATED,
            HttpStatusCodes.Conflict,
            ErrorCode.DOMAIN_CONFLICT,
            ErrorDetails.DOMAIN_CONFLICT,
            {
              location: "PayBookingWithWalletUseCase",
              description: "Payment is pending via gateway",
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
              location: "PayBookingWithWalletUseCase",
              description: "Payment has already been cancelled",
            },
          );
        }
      }

      if (isExpired) {
        throw new ApplicationError(
          PaymentErrorMessage.PAYMENT_WINDOW_EXPIRED,
          HttpStatusCodes.BadRequest,
          ErrorCode.INPUT_TOKEN_EXPIRED,
          ErrorDetails.INPUT_TOKEN_EXPIRED,
          {
            location: "PayBookingWithWalletUseCase",
            description: "The payment window for this booking has expired",
          },
        );
      }

      const wallet = await this._walletRepository.findByCustomerId(passengerId);

      if (!wallet || wallet.balance < amount) {
        throw new ApplicationError(
          PaymentErrorMessage.INSUFFICIENT_WALLET_BALANCE,
          HttpStatusCodes.BadRequest,
          ErrorCode.DOMAIN_CONFLICT,
          ErrorDetails.DOMAIN_CONFLICT,
          {
            location: "PayBookingWithWalletUseCase",
            description:
              "User does not have enough balance to complete the payment",
          },
        );
      }

      const walletTransactionId = this._uidService.generateRandomId();

      await this._walletRepository.addTransactionByCustomerId(passengerId, {
        walletId: wallet.walletId,
        amount: -amount,
        transactionType: TransactionType.DEBIT,
        transactionCategory: TransactionCategory.BOOKING_PAYMENT,
        transactionId: walletTransactionId,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const bookingPayment = await this._bookingPaymentRepository.save({
        bookingId,
        passengerId,
        amount,
        paymentKey,
        paymentMethod: PaymentMethod.WALLET,
        status: TransactionStatus.SUCCESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const transactionId = this._uidService.generateRandomId();
      await this._transactionRepository.save({
        transactionId,
        creditor: "SYSTEM",
        debitor: passengerId,
        transactionType: TransactionType.DEBIT,
        transactionCategory: TransactionCategory.BOOKING_PAYMENT,
        paymentMethod: PaymentMethod.WALLET,
        recordId: bookingPayment.id,
        amount,
        createdAt: new Date(),
      });


      const firstName = customer.firstName ?? "";
      const lastName = customer.lastName ?? "";
      const emailId = customer.emailId ?? "";

      const successEvent: BookingPaymentSuccessEvent = {
        eventName: EventName.BOOKING_PAYMENT_SUCCESS,
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

      await this._eventBus.publish(successEvent);
    } catch (error) {
      if (passengerId && bookingId && paymentKey) {
        const isConflict =
          error instanceof ApplicationError &&
          error.errorCode === ErrorCode.DOMAIN_CONFLICT;

        if (!isConflict) {
          const customer =
            await this._customerRepository.findByCustomerId(passengerId);
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

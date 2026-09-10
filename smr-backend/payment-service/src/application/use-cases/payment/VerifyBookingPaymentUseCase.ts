import { VerifyBookingPaymentOrderRequestDTO } from "#/application/dto/payments/BookingPaymentDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { IPaymentProvider } from "#/application/interfaces/services/IPaymentProvider";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { IVerifyBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IVerifyBookingPaymentUseCase";
import {
  ApplicationError,
  BookingPaymentFailureEvent,
  BookingPaymentSuccessEvent,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  PaymentErrorMessage,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@sharemyride/shared";

/**
 * This class implements the use case that verifies the
 * payment details from client and publishes needed events
 * it handles updating the records as needed
 */
export class VerifyBookingPaymentUseCase implements IVerifyBookingPaymentUseCase {
  constructor(
    private readonly _bookingPaymentRepository: IBookingPaymentRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _customerRepository: ICustomerRepository,
    private readonly _eventBus: IEventBus,
    private readonly _paymentProvider: IPaymentProvider,
    private readonly _uidService: IUniqueIdGenerator,
  ) {}

  /**
   * This method takes the details returned to client after successful payment
   * and verifies its validity to ensure payment is completed. It then updates
   * booking payment repository, transactions repository and
   * publishes success or failure event
   */
  async execute(dto: VerifyBookingPaymentOrderRequestDTO): Promise<void> {
    const bookingPayment =
      await this._bookingPaymentRepository.findByGatewayOrderId(
        dto.orderNumber,
      );

    if (!bookingPayment) {
      throw new ApplicationError(
        PaymentErrorMessage.PAYMENT_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "VerifyBookingPaymentUseCase - findByGatewayOrderId",
          description: `Booking payment not found for order number: ${dto.orderNumber}`,
        },
      );
    }

    if (bookingPayment.status === TransactionStatus.SUCCESS) {
      return;
    }

    const customer = await this._customerRepository.findByCustomerId(
      bookingPayment.passengerId,
    );
    const firstName = customer?.firstName ?? "";
    const lastName = customer?.lastName ?? "";
    const emailId = customer?.emailId ?? "";

    try {
      //verify details from client
      await this._paymentProvider.verifyPayment(
        dto.orderNumber,
        dto.paymentId,
        dto.verificationKey,
      );

      await this._bookingPaymentRepository.updateById(bookingPayment.id, {
        status: TransactionStatus.SUCCESS,
        gatewayPaymentId: dto.paymentId,
        gatewayVeificationKey: dto.verificationKey,
        updatedAt: new Date(),
      });

      const transactionId = this._uidService.generateRandomId();
      await this._transactionRepository.save({
        transactionId,
        creditor: "SYSTEM",
        debitor: bookingPayment.passengerId,
        transactionType: TransactionType.DEBIT,
        transactionCategory: TransactionCategory.BOOKING_PAYMENT,
        paymentMethod: bookingPayment.paymentMethod,
        recordId: bookingPayment.id,
        amount: bookingPayment.amount,
        createdAt: new Date(),
      });


      const successEvent: BookingPaymentSuccessEvent = {
        eventName: EventName.BOOKING_PAYMENT_SUCCESS,
        timestamp: new Date(),
        payload: {
          passengerId: bookingPayment.passengerId,
          firstName,
          lastName,
          emailId,
          bookingId: bookingPayment.bookingId,
          paymentKey: bookingPayment.paymentKey,
        },
      };

      await this._eventBus.publish(successEvent);
    } catch (error) {
      //handle roll back incase of error
      await this._bookingPaymentRepository.updateById(bookingPayment.id, {
        status: TransactionStatus.FAILED,
        gatewayPaymentId: dto.paymentId,
        gatewayVeificationKey: dto.verificationKey,
        updatedAt: new Date(),
      });

      const failureEvent: BookingPaymentFailureEvent = {
        eventName: EventName.BOOKING_PAYMENT_FAILURE,
        timestamp: new Date(),
        payload: {
          passengerId: bookingPayment.passengerId,
          firstName,
          lastName,
          emailId,
          bookingId: bookingPayment.bookingId,
          paymentKey: bookingPayment.paymentKey,
        },
      };

      await this._eventBus.publish(failureEvent);

      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new ApplicationError(
        PaymentErrorMessage.VERIFICATION_FAILED,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "VerifyBookingPaymentUseCase",
          cause: error,
        },
      );
    }
  }
}

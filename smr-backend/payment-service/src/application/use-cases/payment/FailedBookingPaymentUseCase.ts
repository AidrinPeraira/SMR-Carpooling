import { FailedBookingPaymentRequestDTO } from "#/application/dto/payments/BookingPaymentDTO";
import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { ICustomerRepository } from "#/application/interfaces/repository/ICustomerRepository";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IFailedBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IFailedBookingPaymentUseCase";
import {
  TransactionStatus,
  ApplicationError,
  BookingPaymentFailureEvent,
  EventName,
  UserErrorMessage,
  HttpStatusCodes,
  ErrorCode,
  ErrorDetails,
} from "@sharemyride/shared";

/**
 * This class implements the use case that updates
 * the booking payment record status to fialed
 */
export class FailedBookingPaymentUseCase implements IFailedBookingPaymentUseCase {
  constructor(
    private readonly _bookingPaymentsRepository: IBookingPaymentRepository,
    private readonly _customerRepository: ICustomerRepository,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * This method finds the booking payment record with the given id
   * and updates it status to failed only if it is in the pending state
   */
  async execute(dto: FailedBookingPaymentRequestDTO): Promise<void> {
    const booking = await this._bookingPaymentsRepository.findById(
      dto.bookingPaymentID,
    );

    if (booking && booking.status == TransactionStatus.PENDING) {
      const customer = await this._customerRepository.findByCustomerId(
        booking.passengerId,
      );

      if (!customer) {
        throw new ApplicationError(
          UserErrorMessage.NOT_FOUND,
          HttpStatusCodes.NotFound,
          ErrorCode.DOMAIN_NOT_FOUND,
          ErrorDetails.DOMAIN_NOT_FOUND,
          {
            location: "failedBooking payment use case",
            details: "The user was not found in customers repoistory",
          },
        );
      }

      await this._bookingPaymentsRepository.updateById(booking.id, {
        status: TransactionStatus.FAILED,
      });

      const firstName = customer.firstName;
      const lastName = customer.lastName;
      const emailId = customer.emailId;

      const failureEvent: BookingPaymentFailureEvent = {
        eventName: EventName.BOOKING_PAYMENT_FAILURE,
        timestamp: new Date(),
        payload: {
          passengerId: booking.passengerId,
          firstName,
          lastName,
          emailId,
          bookingId: booking.bookingId,
          paymentKey: booking.paymentKey,
        },
      };

      await this._eventBus.publish(failureEvent);
    }
  }
}

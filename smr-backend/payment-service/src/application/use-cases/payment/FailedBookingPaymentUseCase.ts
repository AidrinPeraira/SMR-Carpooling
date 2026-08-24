import { FailedBookingPaymentRequestDTO } from "#/application/dto/payments/BookingPaymentDTO";
import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { IFailedBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IFailedBookingPaymentUseCase";
import { TransactionStatus } from "@sharemyride/shared";

/**
 * This class implements the use case that updates
 * the booking payment record status to fialed
 */
export class FailedBookingPaymentUseCase implements IFailedBookingPaymentUseCase {
  constructor(
    private readonly _bookingPaymentsRepository: IBookingPaymentRepository,
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
      await this._bookingPaymentsRepository.updateById(booking.id, {
        status: TransactionStatus.FAILED,
      });
    }
  }
}

import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { BookingPaymentEntity } from "#/domain/entities/BookingPaymentEntity";

export interface IBookingPaymentRepository extends IBaseRepository<BookingPaymentEntity> {
  findByGatewayOrderId(orderId: string): Promise<BookingPaymentEntity | null>;
  findByBookingId(bookingId: string): Promise<BookingPaymentEntity | null>;
  findByPaymentKey(paymentKey: string): Promise<BookingPaymentEntity | null>;
  findSuccesfulBookingById(
    bookingId: string,
  ): Promise<BookingPaymentEntity | null>;
}

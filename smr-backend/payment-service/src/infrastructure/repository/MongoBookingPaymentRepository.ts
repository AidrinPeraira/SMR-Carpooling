import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { BookingPaymentEntity } from "#/domain/entities/BookingPaymentEntity";
import {
  BookingPaymentDoc,
  BookingPaymentModel,
} from "#/infrastructure/database/models/MongoBookingPaymentModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";

export class MongoBookingPaymentRepository
  extends MongoBaseRepository<BookingPaymentEntity, BookingPaymentDoc>
  implements IBookingPaymentRepository
{
  constructor() {
    super("bookingId", BookingPaymentModel);
  }

  protected toDomainEntityMapper(data: BookingPaymentDoc): BookingPaymentEntity {
    return {
      id: data._id.toString(),
      bookingId: data.bookingId,
      passengerId: data.passengerId,
      amount: data.amount,
      paymentKey: data.paymentKey,
      gatewayOrderId: data.gatewayOrderId ?? undefined,
      gatewayPaymentId: data.gatewayPaymentId ?? undefined,
      gatewayVeificationKey: data.gatewayVeificationKey ?? undefined,
      paymentMethod: data.paymentMethod,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByGatewayOrderId(orderId: string): Promise<BookingPaymentEntity | null> {
    const doc = await this.model.findOne({ gatewayOrderId: orderId }).lean();
    return doc ? this.toDomainEntityMapper(doc) : null;
  }

  async findByBookingId(bookingId: string): Promise<BookingPaymentEntity | null> {
    return this.findByCustomId(bookingId);
  }

  async findByPaymentKey(paymentKey: string): Promise<BookingPaymentEntity | null> {
    const doc = await this.model.findOne({ paymentKey }).lean();
    return doc ? this.toDomainEntityMapper(doc) : null;
  }
}

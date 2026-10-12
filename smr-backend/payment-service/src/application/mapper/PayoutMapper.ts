import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import { PaginatedPayload, PayoutItemDTO } from "@sharemyride/shared";

export class PayoutMapper {
  static toPayoutItem(entity: PayoutEntity): PayoutItemDTO {
    return {
      payout_id: entity.payoutId,
      trip_id: entity.tripId,
      booking_id: entity.bookingId,
      driver_id: entity.driverId,
      passenger_id: entity.passengerId,
      amount: entity.amount,
      commision: entity.commision,
      payable: entity.payable,
      status: entity.status,
      ref_transaction_id: entity.refTransactionId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  static toPayoutList(
    payload: PaginatedPayload<PayoutEntity[]>,
  ): PaginatedPayload<PayoutItemDTO[]> {
    return {
      paginationMeta: payload.paginationMeta,
      data: payload.data.map((item) => PayoutMapper.toPayoutItem(item)),
    };
  }
}

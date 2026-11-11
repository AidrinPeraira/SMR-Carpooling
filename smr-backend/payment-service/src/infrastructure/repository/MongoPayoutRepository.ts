import { IPayoutRepository } from "#/application/interfaces/repository/IPayoutRepository";
import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import {
  PayoutDoc,
  PayoutModel,
} from "#/infrastructure/database/models/MongoPayoutModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import { PaginatedPayload, QueryDTO, SortOrder } from "@sharemyride/shared";

export class MongoPayoutRepository
  extends MongoBaseRepository<PayoutEntity, PayoutDoc>
  implements IPayoutRepository
{
  constructor() {
    super("payoutId", PayoutModel);
  }

  protected toDomainEntityMapper(data: PayoutDoc): PayoutEntity {
    return {
      payoutId: data.payoutId,
      tripId: data.tripId,
      bookingId: data.bookingId,
      driverId: data.driverId,
      passengerId: data.passengerId,
      amount: data.amount,
      commision: data.commision,
      payable: data.payable,
      status: data.status,
      refTransactionId: data.refTransactionId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByDriverId(
    driverId: string,
    query: QueryDTO<PayoutEntity>,
  ): Promise<PaginatedPayload<PayoutEntity[]>> {
    const queryObj: Record<string, any> = { driverId };

    if (query.filterField && query.filterValue) {
      queryObj[query.filterField as string] = query.filterValue;
    }

    const mongoCursor = PayoutModel.find(queryObj);

    if (query.sortField && query.sortValue) {
      mongoCursor.sort({
        [query.sortField.toString()]:
          query.sortValue === SortOrder.ASC ? 1 : -1,
      });
    } else {
      mongoCursor.sort({ createdAt: -1 });
    }

    const skip = (query.page - 1) * query.limit;
    mongoCursor.skip(skip).limit(query.limit);

    const [docs, count] = await Promise.all([
      mongoCursor.lean().exec(),
      PayoutModel.countDocuments(queryObj).exec(),
    ]);

    return {
      data: docs.map((d) => this.toDomainEntityMapper(d)),
      paginationMeta: {
        totalItems: count,
        currentPage: query.page,
        limit: query.limit,
        totalPages: Math.ceil(count / query.limit) || 1,
      },
    };
  }

  async findByBookingId(bookingId: string): Promise<PayoutEntity | null> {
    const data = await PayoutModel.findOne({ bookingId }).lean();
    return data ? this.toDomainEntityMapper(data) : null;
  }
}

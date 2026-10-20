import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import {
  AdminListTransactionsQueryDTO,
  AdminListTransactionsResultDTO,
  GetRevenueTrendResponseDTO,
  GetTransactionsSummaryResponseDTO,
} from "#/application/dto/admin/AdminPaymentsDTO";
import { TransactionEntity } from "#/domain/entities/TransactionEntity";
import {
  TransactionDoc,
  TransactionModel,
} from "#/infrastructure/database/models/MongoTransactionModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import {
  PaginatedPayload,
  SortOrder,
  TransactionCategory,
  TrendRange,
} from "@sharemyride/shared";

export class MongoTransactionRepository
  extends MongoBaseRepository<TransactionEntity, TransactionDoc>
  implements ITransactionRepository
{
  constructor() {
    super("transactionId", TransactionModel);
  }

  protected toDomainEntityMapper(data: TransactionDoc): TransactionEntity {
    return {
      transactionId: data.transactionId,
      creditor: data.creditor,
      debitor: data.debitor,
      transactionType: data.transactionType,
      transactionCategory: data.transactionCategory,
      paymentMethod: data.paymentMethod,
      recordId: data.recordId,
      amount: data.amount,
      createdAt: data.createdAt,
    };
  }

  /**
   * Fetches all platform transactions for admin use with support for
   * text search across relevant fields, single-field filtering, and sorting.
   * Returns a paginated result set.
   *
   * @param query - AdminListTransactionsQueryDTO containing pagination, search, filter and sort parameters
   * @returns Paginated list of AdminListTransactionsResultDTO
   */
  async findAllPaginated(
    query: AdminListTransactionsQueryDTO,
  ): Promise<PaginatedPayload<AdminListTransactionsResultDTO[]>> {
    const queryObj: Record<string, any> = {};

    if (query.search && query.searchFields && query.searchFields.length > 0) {
      const searchConditions: any[] = [];
      const hasCustomerField =
        query.searchFields.includes(
          "creditor" as keyof AdminListTransactionsResultDTO,
        ) ||
        query.searchFields.includes(
          "debitor" as keyof AdminListTransactionsResultDTO,
        );

      let matchingCustomerIds: string[] = [];
      if (hasCustomerField) {
        const { CustomerModel } =
          await import("#/infrastructure/database/models/MongoCustomerModel");
        const matchingCustomers = await CustomerModel.find({
          $or: [
            { firstName: { $regex: query.search, $options: "i" } },
            { lastName: { $regex: query.search, $options: "i" } },
          ],
        })
          .select("customerId")
          .lean()
          .exec();
        matchingCustomerIds = matchingCustomers.map((c) => c.customerId);
      }

      for (const field of query.searchFields) {
        if (
          (field as string) === "creditor" ||
          (field as string) === "debitor"
        ) {
          // Search by name match (resolved to IDs) or by direct ID match
          const orConditionsForField: any[] = [
            { [field]: { $regex: query.search, $options: "i" } },
          ];
          if (matchingCustomerIds.length > 0) {
            orConditionsForField.push({
              [field]: { $in: matchingCustomerIds },
            });
          }
          searchConditions.push({ $or: orConditionsForField });
        } else {
          searchConditions.push({
            [field]: { $regex: query.search, $options: "i" },
          });
        }
      }

      if (searchConditions.length > 0) {
        queryObj.$or = searchConditions;
      }
    }

    if (query.filterField && query.filterValue !== undefined) {
      queryObj[query.filterField as string] = query.filterValue;
    }

    const mongoCursor = TransactionModel.find(queryObj);

    if (query.sortField && query.sortValue) {
      mongoCursor.sort({
        [query.sortField.toString()]:
          query.sortValue === SortOrder.ASC ? 1 : -1,
      });
    } else {
      // Default: most recent first
      mongoCursor.sort({ createdAt: -1 });
    }

    const skip = (query.page - 1) * query.limit;
    mongoCursor.skip(skip).limit(query.limit);

    const [docs, count] = await Promise.all([
      mongoCursor.lean().exec(),
      TransactionModel.countDocuments(queryObj).exec(),
    ]);

    // Extract unique customer IDs
    const uniqueCustomerIds = new Set<string>();
    docs.forEach((doc) => {
      if (doc.creditor && doc.creditor !== "SYSTEM")
        uniqueCustomerIds.add(doc.creditor);
      if (doc.debitor && doc.debitor !== "SYSTEM")
        uniqueCustomerIds.add(doc.debitor);
    });

    // We can require the model here or at top. It's safer to import at top. Let's assume it's imported.
    const { CustomerModel } =
      await import("#/infrastructure/database/models/MongoCustomerModel");

    // Fetch names
    const customers = await CustomerModel.find({
      customerId: { $in: Array.from(uniqueCustomerIds) },
    })
      .lean()
      .exec();

    const customerMap = new Map<string, string>();
    customers.forEach((c) => {
      customerMap.set(c.customerId, `${c.firstName} ${c.lastName}`.trim());
    });

    const data: AdminListTransactionsResultDTO[] = docs.map((doc) => ({
      transactionId: doc.transactionId,
      transactionDate: doc.createdAt,
      transactionAmount: doc.amount,
      creditorId: doc.creditor === "SYSTEM" ? null : doc.creditor,
      creditorName:
        doc.creditor === "SYSTEM"
          ? "SYSTEM"
          : customerMap.get(doc.creditor) || doc.creditor,
      debitorId: doc.debitor === "SYSTEM" ? null : doc.debitor,
      debitorName:
        doc.debitor === "SYSTEM"
          ? "SYSTEM"
          : customerMap.get(doc.debitor) || doc.debitor,
      paymentMethod: doc.paymentMethod,
      transactionType: doc.transactionType,
      transactionCategory: doc.transactionCategory,
      recordId: doc.recordId,
    }));

    return {
      data,
      paginationMeta: {
        totalItems: count,
        currentPage: query.page,
        limit: query.limit,
        totalPages: Math.ceil(count / query.limit) || 1,
      },
    };
  }

  async getCustomerEarnings(customerId: string): Promise<number> {
    const result = await TransactionModel.aggregate([
      {
        $match: {
          creditor: customerId,
          transactionCategory: TransactionCategory.PAYOUT,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]).exec();

    return result.length > 0 ? result[0].total : 0;
  }

  async getTransactionsSummary(): Promise<GetTransactionsSummaryResponseDTO> {
    const result = await TransactionModel.aggregate([
      {
        $group: {
          _id: "$transactionCategory",
          total: { $sum: "$amount" },
        },
      },
    ]).exec();

    const categoryMap = new Map<string, number>();
    for (const item of result) {
      categoryMap.set(item._id, item.total);
    }

    const bookingRevenue = categoryMap.get(TransactionCategory.BOOKING_PAYMENT) ?? 0;
    const payoutsIssued = categoryMap.get(TransactionCategory.PAYOUT) ?? 0;
    const refundsIssued = categoryMap.get(TransactionCategory.REFUND) ?? 0;
    const commission = categoryMap.get(TransactionCategory.COMMISSION) ?? 0;

    return {
      totalRevenue: bookingRevenue + commission,
      bookingRevenue,
      payoutsIssues: payoutsIssued,
      refundsIssued,
    };
  }

  async getRevenueTrend(range: TrendRange): Promise<GetRevenueTrendResponseDTO> {
    const now = new Date();
    let startDate: Date;
    let groupBy: "day" | "week" | "month";

    switch (range) {
      case TrendRange.LAST_WEEK:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = "day";
        break;
      case TrendRange.LAST_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        groupBy = "week";
        break;
      case TrendRange.LAST_YEAR:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        groupBy = "month";
        break;
    }

    const docs = await TransactionModel.find({
      createdAt: { $gte: startDate },
      transactionCategory: TransactionCategory.BOOKING_PAYMENT,
    })
      .select("amount createdAt")
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    const buckets = new Map<string, number>();

    for (const doc of docs) {
      const d = new Date(doc.createdAt);
      let label = "";

      switch (groupBy) {
        case "day": {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          label = days[d.getDay()]!;
          break;
        }
        case "week": {
          const weekStart = new Date(d);
          weekStart.setDate(d.getDate() - d.getDay());
          label = `W${Math.ceil(weekStart.getDate() / 7)}`;
          break;
        }
        case "month": {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          label = months[d.getMonth()]!;
          break;
        }
      }

      buckets.set(label, (buckets.get(label) ?? 0) + doc.amount);
    }

    return {
      trendRange: range,
      data: Array.from(buckets.entries()).map(([label, value]) => ({ label, value })),
    };
  }
}

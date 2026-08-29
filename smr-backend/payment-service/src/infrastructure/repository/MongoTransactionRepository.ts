import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { AdminListTransactionsQueryDTO, AdminListTransactionsResultDTO } from "#/application/dto/admin/AdminPaymentsDTO";
import { TransactionEntity } from "#/domain/entities/TransactionEntity";
import {
  TransactionDoc,
  TransactionModel,
} from "#/infrastructure/database/models/MongoTransactionModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import {
  PaginatedPayload,
  SortOrder,
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
        query.searchFields.includes("creditor" as any) ||
        query.searchFields.includes("debitor" as any);

      let matchingCustomerIds: string[] = [];
      if (hasCustomerField) {
        const { CustomerModel } = await import(
          "#/infrastructure/database/models/MongoCustomerModel"
        );
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
        if ((field as string) === "creditor" || (field as string) === "debitor") {
          // Search by name match (resolved to IDs) or by direct ID match
          const orConditionsForField: any[] = [
            { [field]: { $regex: query.search, $options: "i" } },
          ];
          if (matchingCustomerIds.length > 0) {
            orConditionsForField.push({ [field]: { $in: matchingCustomerIds } });
          }
          searchConditions.push({ $or: orConditionsForField });
        } else {
          searchConditions.push({ [field]: { $regex: query.search, $options: "i" } });
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
        [query.sortField.toString()]: query.sortValue === SortOrder.ASC ? 1 : -1,
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
    docs.forEach(doc => {
      if (doc.creditor && doc.creditor !== "SYSTEM") uniqueCustomerIds.add(doc.creditor);
      if (doc.debitor && doc.debitor !== "SYSTEM") uniqueCustomerIds.add(doc.debitor);
    });

    // We can require the model here or at top. It's safer to import at top. Let's assume it's imported.
    const { CustomerModel } = await import("#/infrastructure/database/models/MongoCustomerModel");
    
    // Fetch names
    const customers = await CustomerModel.find({
      customerId: { $in: Array.from(uniqueCustomerIds) }
    }).lean().exec();

    const customerMap = new Map<string, string>();
    customers.forEach(c => {
      customerMap.set(c.customerId, `${c.firstName} ${c.lastName}`.trim());
    });

    const data: AdminListTransactionsResultDTO[] = docs.map((doc) => ({
      transactionId: doc.transactionId,
      transactionDate: doc.createdAt,
      transactionAmount: doc.amount,
      creditorId: doc.creditor === "SYSTEM" ? null : doc.creditor,
      creditorName: doc.creditor === "SYSTEM" ? "SYSTEM" : (customerMap.get(doc.creditor) || doc.creditor),
      debitorId: doc.debitor === "SYSTEM" ? null : doc.debitor,
      debitorName: doc.debitor === "SYSTEM" ? "SYSTEM" : (customerMap.get(doc.debitor) || doc.debitor),
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
}


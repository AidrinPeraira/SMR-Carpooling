import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { TransactionEntity } from "#/domain/entities/TransactionEntity";
import {
  TransactionDoc,
  TransactionModel,
} from "#/infrastructure/database/models/MongoTransactionModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";

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
    };
  }
}

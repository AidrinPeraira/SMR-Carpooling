import { IWalletTransactionRepository } from "#/application/interfaces/repository/IWalletTransactionRepository";
import { WalletTransactionEntity } from "#/domain/entities/WalletTransactionEntity";
import {
  WalletTransactionDoc,
  WalletTransactionModel,
} from "#/infrastructure/database/models/MongoWalletTransactionModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import { TransactionCategory, TransactionType } from "@sharemyride/shared";

export class MongoWalletTransactionRepository
  extends MongoBaseRepository<WalletTransactionEntity, WalletTransactionDoc>
  implements IWalletTransactionRepository
{
  constructor() {
    super("transactionId", WalletTransactionModel);
  }

  protected toDomainEntityMapper(
    data: WalletTransactionDoc,
  ): WalletTransactionEntity {
    return {
      id: data._id.toString(),
      walletId: data.walletId,
      amount: data.amount,
      transactionType: data.transactionType as TransactionType,
      transactionCategory: data.transactionCategory as TransactionCategory,
      transactionId: data.transactionId,
      date: data.date,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByWalletId(walletId: string): Promise<WalletTransactionEntity[]> {
    const docs = await this.model.find({ walletId }).lean();
    return docs.map((doc) =>
      this.toDomainEntityMapper(doc as WalletTransactionDoc),
    );
  }
}

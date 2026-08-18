import { IWalletRepository } from "#/application/interfaces/repository/IWalletRepository";
import { WalletEntity } from "#/domain/entities/WalletEntity";
import { WalletTransactionEntity } from "#/domain/entities/WalletTransactionEntity";
import {
  WalletDoc,
  WalletModel,
} from "#/infrastructure/database/models/MongoWalletModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";

export class MongoWalletRepository
  extends MongoBaseRepository<WalletEntity, WalletDoc>
  implements IWalletRepository
{
  constructor() {
    super("walletId", WalletModel);
  }

  protected toDomainEntityMapper(data: WalletDoc): WalletEntity {
    return {
      id: data._id.toString(),
      walletId: data.walletId,
      customerId: data.customerId,
      balance: data.balance,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByCustomerId(customerId: string): Promise<WalletEntity | null> {
    const doc = await this.model.findOne({ customerId }).lean();
    return doc ? this.toDomainEntityMapper(doc) : null;
  }

  async addTransaction(
    walletId: string,
    transaction: WalletTransactionEntity,
  ): Promise<WalletEntity> {
    const updatedDoc = await this.model.findOneAndUpdate(
      { walletId },
      {
        $push: { walletTransactions: transaction },
        $inc: { balance: transaction.amount },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    );

    if (!updatedDoc) {
      throw new Error(`Wallet not found for walletId: ${walletId}`);
    }

    return this.toDomainEntityMapper(updatedDoc);
  }
}

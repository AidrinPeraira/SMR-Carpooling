import { IWalletRepository } from "#/application/interfaces/repository/IWalletRepository";
import mongoose from "mongoose";
import { WalletEntity } from "#/domain/entities/WalletEntity";
import { WalletTransactionEntity } from "#/domain/entities/WalletTransactionEntity";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PaymentErrorMessage,
  TransactionCategory,
  TransactionType,
} from "@sharemyride/shared";
import {
  WalletDoc,
  WalletModel,
} from "#/infrastructure/database/models/MongoWalletModel";
import { WalletTransactionModel } from "#/infrastructure/database/models/MongoWalletTransactionModel";
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

  async addTransactionByCustomerId(
    customerId: string,
    transaction: Omit<WalletTransactionEntity, "id">,
  ): Promise<WalletEntity> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await WalletTransactionModel.create([transaction], { session });

      const updatedDoc = await this.model.findOneAndUpdate(
        { customerId },
        {
          $inc: { balance: transaction.amount },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after", session },
      );

      if (!updatedDoc) {
        throw new ApplicationError(
          PaymentErrorMessage.WALLET_NOT_FOUND,
          HttpStatusCodes.NotFound,
          ErrorCode.DOMAIN_NOT_FOUND,
          ErrorDetails.DOMAIN_NOT_FOUND,
          {
            location: "MongoWalletRepository.addTransactionByCustomerId",
            description: `Wallet not found for customerId: ${customerId}`,
          },
        );
      }

      await session.commitTransaction();
      return this.toDomainEntityMapper(updatedDoc);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getWalletTransactions(
    walletId: string,
  ): Promise<WalletTransactionEntity[]> {
    const docs = await WalletTransactionModel.find({ walletId }).lean();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      walletId: doc.walletId,
      amount: doc.amount,
      transactionType: doc.transactionType as TransactionType,
      transactionCategory: doc.transactionCategory as TransactionCategory,
      transactionId: doc.transactionId,
      date: doc.date,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }
}

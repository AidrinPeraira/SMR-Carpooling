import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { WalletEntity } from "#/domain/entities/WalletEntity";
import { WalletTransactionEntity } from "#/domain/entities/WalletTransactionEntity";

/**
 * Repository interface for wallet data in payment service
 */
export interface IWalletRepository extends IBaseRepository<WalletEntity> {
  findByCustomerId(customerId: string): Promise<WalletEntity | null>;

  addTransactionByCustomerId(
    customerId: string,
    transaction: Omit<WalletTransactionEntity, "id">,
  ): Promise<WalletEntity>;

  getWalletTransactions(walletId: string): Promise<WalletTransactionEntity[]>;
}

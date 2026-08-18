import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { WalletTransactionEntity } from "#/domain/entities/WalletTransactionEntity";

/**
 * Repository interface for wallet transactions in payment service
 */
export interface IWalletTransactionRepository
  extends IBaseRepository<WalletTransactionEntity> {
  findByWalletId(walletId: string): Promise<WalletTransactionEntity[]>;
}

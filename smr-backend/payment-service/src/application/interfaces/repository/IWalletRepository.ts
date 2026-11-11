import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { WalletEntity } from "#/domain/entities/WalletEntity";
import { WalletTransactionEntity } from "#/domain/entities/WalletTransactionEntity";
import { PaginatedPayload, QueryDTO } from "@sharemyride/shared";

/**
 * Repository interface for wallet data in payment service
 */
export interface IWalletRepository extends IBaseRepository<WalletEntity> {
  findByCustomerId(customerId: string): Promise<WalletEntity | null>;

  addTransactionByCustomerId(
    customerId: string,
    transaction: Omit<WalletTransactionEntity, "id">,
  ): Promise<WalletEntity>;

  getWalletTransactions(
    walletId: string,
    query: QueryDTO<WalletTransactionEntity>
  ): Promise<PaginatedPayload<WalletTransactionEntity[]>>;
}

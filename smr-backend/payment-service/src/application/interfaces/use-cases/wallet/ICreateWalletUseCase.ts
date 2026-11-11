import { WalletEntity } from "#/domain/entities/WalletEntity";

/**
 * Interface for the use case to create a new wallet for a customer
 */
export interface ICreateWalletUseCase {
  execute(customerId: string): Promise<WalletEntity>;
}

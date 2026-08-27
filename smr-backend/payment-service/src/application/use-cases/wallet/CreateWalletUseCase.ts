import { IWalletRepository } from "#/application/interfaces/repository/IWalletRepository";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { ICreateWalletUseCase } from "#/application/interfaces/use-cases/wallet/ICreateWalletUseCase";
import { WalletEntity } from "#/domain/entities/WalletEntity";

/**
 * Implementation of the use case to create a new wallet for a customer
 */
export class CreateWalletUseCase implements ICreateWalletUseCase {
  constructor(
    private readonly _walletRepository: IWalletRepository,
    private readonly _uidService: IUniqueIdGenerator,
  ) {}

  async execute(customerId: string): Promise<WalletEntity> {
    const existing = await this._walletRepository.findByCustomerId(customerId);
    if (existing) {
      return existing;
    }

    const now = new Date();
    const walletId = this._uidService.generateRandomId();

    return this._walletRepository.save({
      walletId,
      customerId,
      balance: 0,
      createdAt: now,
      updatedAt: now,
    });
  }
}

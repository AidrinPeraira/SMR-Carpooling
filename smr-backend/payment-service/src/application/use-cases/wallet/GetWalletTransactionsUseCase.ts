import {
  GetWalletTransactionsQueryDTO,
  GetWalletTransactionsResponseDTO,
} from "#/application/dto/wallet/WalletTransactionsDTO";
import { IWalletRepository } from "#/application/interfaces/repository/IWalletRepository";
import { IGetWalletTransactionsUseCase } from "#/application/interfaces/use-cases/wallet/IGetWalletTransactionDetails";
import { WalletTransactionEntity } from "#/domain/entities/WalletTransactionEntity";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PaymentErrorMessage,
  QueryDTO,
} from "@sharemyride/shared";

export class GetWalletTransactionsUseCase
  implements IGetWalletTransactionsUseCase
{
  constructor(private readonly _walletRepository: IWalletRepository) {}

  /**
   * This methods finds the wallet belonging to the given user
   * and returns a paginated reponse of the trnasactions
   */
  async execute(
    dto: GetWalletTransactionsQueryDTO,
    userId: string,
  ): Promise<GetWalletTransactionsResponseDTO> {
    const wallet = await this._walletRepository.findByCustomerId(userId);

    if (!wallet) {
      throw new ApplicationError(
        PaymentErrorMessage.WALLET_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "GetWalletTransactionsUseCase.execute",
          description: `Wallet not found for customerId: ${userId}`,
        },
      );
    }

    const paginatedResult = await this._walletRepository.getWalletTransactions(
      wallet.walletId,
      dto as unknown as QueryDTO<WalletTransactionEntity>,
    );

    return {
      walletId: wallet.walletId,
      walletBalance: wallet.balance,
      transactions: {
        data: paginatedResult.data.map((t) => ({
          id: t.id,
          amount: t.amount,
          transactionType: t.transactionType,
          transactionCategory: t.transactionCategory,
          transactionId: t.transactionId,
          date: t.date,
        })),
        paginationMeta: paginatedResult.paginationMeta,
      },
    };
  }
}

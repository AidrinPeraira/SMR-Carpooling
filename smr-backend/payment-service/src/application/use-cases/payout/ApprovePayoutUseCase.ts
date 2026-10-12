import { IPayoutRepository } from "#/application/interfaces/repository/IPayoutRepository";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { IWalletRepository } from "#/application/interfaces/repository/IWalletRepository";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { IApprovePayoutUseCase } from "#/application/interfaces/use-cases/payout/IApprovePayoutUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PaymentMethod,
  PayoutErrorMessage,
  PayoutStatus,
  TransactionCategory,
  TransactionType,
} from "@sharemyride/shared";

/**
 * Approves a pending payout, creates the ledger transaction,
 * credits the driver's wallet, and links the transaction to the payout.
 */
export class ApprovePayoutUseCase implements IApprovePayoutUseCase {
  constructor(
    private readonly _payoutRepository: IPayoutRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _uidService: IUniqueIdGenerator,
  ) {}

  async execute(payoutId: string): Promise<void> {
    const payout = await this._payoutRepository.findByCustomId(payoutId);

    if (!payout) {
      throw new ApplicationError(
        PayoutErrorMessage.PAYOUT_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ApprovePayoutUseCase",
          description: `Payout not found with payoutId: ${payoutId}`,
        },
      );
    }

    if (payout.status === PayoutStatus.COMPLETED) {
      throw new ApplicationError(
        PayoutErrorMessage.PAYOUT_ALREADY_COMPLETED,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "ApprovePayoutUseCase",
          description: `Payout ${payoutId} has already been completed`,
        },
      );
    }

    if (payout.status !== PayoutStatus.PENDING) {
      throw new ApplicationError(
        PayoutErrorMessage.PAYOUT_NOT_PENDING,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "ApprovePayoutUseCase",
          description: `Payout ${payoutId} status is '${payout.status}', expected '${PayoutStatus.PENDING}'`,
        },
      );
    }

    const wallet = await this._walletRepository.findByCustomerId(
      payout.driverId,
    );

    if (!wallet) {
      throw new ApplicationError(
        PayoutErrorMessage.WALLET_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "ApprovePayoutUseCase",
          description: `Wallet not found for driverId: ${payout.driverId}`,
        },
      );
    }

    const now = new Date();
    const transactionId = this._uidService.generateRandomId();

    await this._transactionRepository.save({
      transactionId,
      creditor: payout.driverId,
      debitor: payout.passengerId,
      transactionType: TransactionType.CREDIT,
      transactionCategory: TransactionCategory.PAYOUT,
      paymentMethod: PaymentMethod.WALLET,
      recordId: payout.payoutId,
      amount: payout.payable,
      createdAt: now,
    });

    await this._walletRepository.addTransactionByCustomerId(payout.driverId, {
      walletId: wallet.walletId,
      amount: payout.payable,
      transactionType: TransactionType.CREDIT,
      transactionCategory: TransactionCategory.PAYOUT,
      transactionId,
      date: now,
      createdAt: now,
      updatedAt: now,
    });

    await this._payoutRepository.updateByCustomId(payoutId, {
      status: PayoutStatus.COMPLETED,
      refTransactionId: transactionId,
      updatedAt: now,
    });
  }
}

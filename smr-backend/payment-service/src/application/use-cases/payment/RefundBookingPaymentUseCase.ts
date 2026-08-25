import { IBookingPaymentRepository } from "#/application/interfaces/repository/IBookingPaymentRepository";
import { ITransactionRepository } from "#/application/interfaces/repository/ITransactionRepository";
import { IWalletRepository } from "#/application/interfaces/repository/IWalletRepository";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { IRefundBookingPaymentUseCase } from "#/application/interfaces/use-cases/payment/IRefundBookingPaymentUseCase";
import {
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  PaymentErrorMessage,
  PaymentMethod,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@sharemyride/shared";

/**
 * This class implements the use case that handles
 * checking the payment status against a booking id
 * and issuing a wallet refund if found
 */
export class RefundBookingPaymentUseCase implements IRefundBookingPaymentUseCase {
  constructor(
    private readonly _bookingPaymentRespository: IBookingPaymentRepository,
    private readonly _walletRepository: IWalletRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _uidService: IUniqueIdGenerator,
  ) {}

  /**
   * This method checks for a successful payment agianst the bookingPayements
   * records and if found issues a wallet refund if found. else it just drops
   * the request.
   *
   * @param bookingId : ID of passenger booking as string
   */
  async execute(bookingId: string): Promise<void> {
    const successfulBooking =
      await this._bookingPaymentRespository.findSuccesfulBookingById(bookingId);

    if (successfulBooking) {
      const wallet = await this._walletRepository.findByCustomerId(
        successfulBooking.passengerId,
      );

      if (!wallet) {
        throw new ApplicationError(
          PaymentErrorMessage.WALLET_NOT_FOUND,
          HttpStatusCodes.NotFound,
          ErrorCode.DOMAIN_NOT_FOUND,
          {
            location: "RefundBookingPaymentUseCase",
            description: `Wallet not found for customerId: ${successfulBooking.passengerId}`,
          },
        );
      }

      const now = new Date();

      //add wallet trnasactoin
      await this._walletRepository.addTransactionByCustomerId(
        successfulBooking.passengerId,
        {
          walletId: wallet.walletId,
          amount: successfulBooking.amount,
          transactionType: TransactionType.CREDIT,
          transactionCategory: TransactionCategory.REFUND,
          transactionId: successfulBooking.id,
          date: now,
          createdAt: now,
          updatedAt: now,
        },
      );

      //add ledger transaction
      await this._transactionRepository.save({
        transactionId: this._uidService.generateRandomId(),
        debitor: "SYSTEM",
        creditor: successfulBooking.passengerId,
        transactionType: TransactionType.CREDIT,
        transactionCategory: TransactionCategory.REFUND,
        paymentMethod: PaymentMethod.WALLET,
        recordId: successfulBooking.id,
      });

      //upate booking payment status
      await this._bookingPaymentRespository.updateById(successfulBooking.id, {
        status: TransactionStatus.REFUNDED,
        updatedAt: now,
      });
    }
  }
}

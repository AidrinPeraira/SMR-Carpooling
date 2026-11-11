import { IPayoutRepository } from "#/application/interfaces/repository/IPayoutRepository";
import { IAdminGetPayoutDetailsUseCase } from "#/application/interfaces/use-cases/payout/IAdminGetPayoutDetailsUseCase";
import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PayoutErrorMessage,
} from "@sharemyride/shared";

/**
 * Retrieves a single payout by its ID for admin review
 */
export class AdminGetPayoutDetailsUseCase
  implements IAdminGetPayoutDetailsUseCase
{
  constructor(private readonly _payoutRepository: IPayoutRepository) {}

  async execute(payoutId: string): Promise<PayoutEntity> {
    const payout = await this._payoutRepository.findByCustomId(payoutId);

    if (!payout) {
      throw new ApplicationError(
        PayoutErrorMessage.PAYOUT_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "AdminGetPayoutDetailsUseCase",
          description: `Payout not found with payoutId: ${payoutId}`,
        },
      );
    }

    return payout;
  }
}

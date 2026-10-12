import { CreatePayoutRequestDTO } from "#/application/dto/payout/CreatePayoutDTO";
import { IPayoutRepository } from "#/application/interfaces/repository/IPayoutRepository";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { ICreatePayoutUseCase } from "#/application/interfaces/use-cases/payout/ICreatePayoutUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PayoutErrorMessage,
  PayoutStatus,
} from "@sharemyride/shared";

const COMMISSION_RATE = 0.1;

/**
 * Creates a pending payout record when a passenger
 * is dropped off, calculating the commission and payable.
 */
export class CreatePayoutUseCase implements ICreatePayoutUseCase {
  constructor(
    private readonly _payoutRepository: IPayoutRepository,
    private readonly _uidService: IUniqueIdGenerator,
  ) {}

  async execute(dto: CreatePayoutRequestDTO): Promise<void> {
    const existing = await this._payoutRepository.findByBookingId(
      dto.bookingId,
    );

    if (existing) {
      throw new ApplicationError(
        PayoutErrorMessage.PAYOUT_ALREADY_EXISTS,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_ALREADY_EXISTS,
        ErrorDetails.DOMAIN_ALREADY_EXISTS,
        {
          location: "CreatePayoutUseCase",
          description: `Payout already exists for bookingId: ${dto.bookingId}`,
        },
      );
    }

    const commission = Math.round(dto.amount * COMMISSION_RATE * 100) / 100;
    const payable = Math.round((dto.amount - commission) * 100) / 100;
    const now = new Date();

    await this._payoutRepository.save({
      payoutId: this._uidService.generateRandomId(),
      tripId: dto.journeyId,
      bookingId: dto.bookingId,
      driverId: dto.driverId,
      passengerId: dto.passengerId,
      amount: dto.amount,
      commision: commission,
      payable,
      status: PayoutStatus.PENDING,
      refTransactionId: null,
      createdAt: now,
      updatedAt: now,
    });
  }
}

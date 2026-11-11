import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { PayoutEntity } from "#/domain/entities/PayoutEntity";
import { PaginatedPayload, QueryDTO } from "@sharemyride/shared";

export interface IPayoutRepository extends IBaseRepository<PayoutEntity> {
  findByDriverId(
    driverId: string,
    query: QueryDTO<PayoutEntity>,
  ): Promise<PaginatedPayload<PayoutEntity[]>>;

  findByBookingId(bookingId: string): Promise<PayoutEntity | null>;
}

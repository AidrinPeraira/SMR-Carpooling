import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/PassengerListTripsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * this use case gets requeirements data from passnegers
 * and queries the trip repository for matching trips to
 * return a paginated response dto
 */
export interface IListTripsUseCase {
  execute(
    query: ListTripsRequestDTO,
  ): Promise<PaginatedPayload<ListTripsResultDTO[]>>;
}

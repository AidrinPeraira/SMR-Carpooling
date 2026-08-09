import {
  ListTripsRequestDTO,
  ListTripsResultDTO,
} from "#/application/dto/trip/ListTripsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IListTripsUseCase } from "#/application/interfaces/use-case/trip/IListTripsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * Use case responsible for searching and listing matching trips
 * based on passenger requirements (origin, destination, time).
 */
export class ListTripsUseCase implements IListTripsUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  /**
   * Executes trip search query against the trip repository
   *
   * @param query Search query parameters containing origin, destination, and time
   * @returns Paginated payload of matching trip DTOs
   */
  async execute(
    query: ListTripsRequestDTO,
  ): Promise<PaginatedPayload<ListTripsResultDTO[]>> {
    return this._tripRepository.findMatchingTrips(query);
  }
}

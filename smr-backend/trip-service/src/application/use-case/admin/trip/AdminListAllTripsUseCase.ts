import {
  AdminGetAllTripsQuery,
  AdminGetAllTripsResponseDTO,
} from "#/application/dto/admin/AdminTripsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IAdminListAllTripsUseCase } from "#/application/interfaces/use-case/admin/trip/IAdminListAllTripsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This class is the implementation for the use case that
 * lists all trips in the platform for the admin as a paginated
 * result
 */
export class AdminListAllTripsUseCase implements IAdminListAllTripsUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  /**
   * This method takes the query dto for trips table and returns the matching list
   * of trips data from the trips repository
   */
  async execute(
    query: AdminGetAllTripsQuery,
  ): Promise<PaginatedPayload<AdminGetAllTripsResponseDTO[]>> {

    return await this._tripRepository.findAllTrips(query);
  }
}


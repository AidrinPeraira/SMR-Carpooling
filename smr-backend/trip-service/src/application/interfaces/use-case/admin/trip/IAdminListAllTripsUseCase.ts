import {
  AdminGetAllTripsQuery,
  AdminGetAllTripsResponseDTO,
} from "#/application/dto/admin/AdminTripsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This use case lists all trips in the platform for the admin dash
 */
export interface IAdminListAllTripsUseCase {
  execute(
    query: AdminGetAllTripsQuery,
  ): Promise<PaginatedPayload<AdminGetAllTripsResponseDTO[]>>;
}


import {
  AdminListAllBookingsQueryDTO,
  AdminListAllBookingsResponseDTO,
} from "#/application/dto/admin/AdminBookingsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This use case lists all passenger bookings
 * for admin dashboard
 */
export interface IAdminListAllBookingsUseCase {
  execute(
    query: AdminListAllBookingsQueryDTO,
  ): Promise<PaginatedPayload<AdminListAllBookingsResponseDTO[]>>;
}


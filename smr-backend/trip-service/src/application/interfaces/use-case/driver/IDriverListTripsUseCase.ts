import {
  DriverGetAllTripsQueryDTO,
  DriverListTripsResponseDTO,
} from "#/application/dto/driver/DriverTripsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * This use case lists all trips created by a driver
 */
export interface IDriverListTripsUseCase {
  execute(
    driverId: string,
    query?: DriverGetAllTripsQueryDTO,
  ): Promise<PaginatedPayload<DriverListTripsResponseDTO[]>>;
}

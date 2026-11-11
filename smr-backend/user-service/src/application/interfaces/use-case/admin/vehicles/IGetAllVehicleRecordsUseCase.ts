import {
  GetAllVehicleRecordsRequestQueryDTO,
  GetAllVehicleRecordsResponseDTO,
} from "#/application/dto/admin/vehicles/AdminVehicleRecordsDTO";
import { PaginatedPayload } from "@sharemyride/shared";

export interface IGetAllVehicleRecordsUseCase {
  execute(
    query: GetAllVehicleRecordsRequestQueryDTO,
  ): Promise<PaginatedPayload<GetAllVehicleRecordsResponseDTO[]>>;
}

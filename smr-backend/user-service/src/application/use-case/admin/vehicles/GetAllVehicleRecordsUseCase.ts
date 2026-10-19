import {
  GetAllVehicleRecordsRequestQueryDTO,
  GetAllVehicleRecordsResponseDTO,
} from "#/application/dto/admin/vehicles/AdminVehicleRecordsDTO";
import { IVehicleRecordRepository } from "#/application/interfaces/repository/IVehicleRecordRepository";
import { IGetAllVehicleRecordsUseCase } from "#/application/interfaces/use-case/admin/vehicles/IGetAllVehicleRecordsUseCase";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
import { PaginatedPayload } from "@sharemyride/shared";

export class GetAllVehicleRecordsUseCase
  implements IGetAllVehicleRecordsUseCase
{
  constructor(
    private readonly _vehicleRecordRepository: IVehicleRecordRepository,
  ) {}

  async execute(
    query: GetAllVehicleRecordsRequestQueryDTO,
  ): Promise<PaginatedPayload<GetAllVehicleRecordsResponseDTO[]>> {
    const searchFields: (keyof VehicleRecordEntity)[] = [
      "vehicleMake",
      "vehicleModel",
      "registrationNumber",
    ];

    const queryWithSearchFields = {
      ...query,
      searchFields: query.search ? searchFields : undefined,
    };

    const result = await this._vehicleRecordRepository.find(
      queryWithSearchFields,
    );

    return {
      data: result.data.map((record) => ({
        recordId: record.recordId,
        applicationId: record.applicationId,
        vehicleType: record.vehicleType,
        vehicleMake: record.vehicleMake,
        vehicleModel: record.vehicleModel,
        vehicleCapacity: record.vehicleCapacity,
        registrationNumber: record.registrationNumber,
        registrationExpiry: record.registrationExpiry,
        insuranceNumber: record.insuranceNumber,
        insuranceExpiry: record.insuranceExpiry,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      })),
      paginationMeta: result.paginationMeta,
    };
  }
}

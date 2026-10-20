import { GetAllVehicleRecordsResponseDTO } from "#/application/dto/admin/vehicles/AdminVehicleRecordsDTO";
import { vehicleRecordQueryFieldMapper } from "#/presentation/utils/query-mapper";
import { AdminVehicleRecordResult, QueryRequest } from "@sharemyride/shared";
import { GetAllVehicleRecordsRequestQueryDTO } from "#/application/dto/admin/vehicles/AdminVehicleRecordsDTO";

export class AdminVehicleRecordsMapper {
  static toGetAllVehicleRecordsRequestQuery(
    query: QueryRequest,
  ): GetAllVehicleRecordsRequestQueryDTO {
    const { filterField, sortField, searchFields, ...rest } = query;

    return {
      ...rest,
      filterField: filterField
        ? vehicleRecordQueryFieldMapper(filterField)
        : undefined,
      sortField: sortField
        ? vehicleRecordQueryFieldMapper(sortField)
        : undefined,
      searchFields: searchFields
        ? searchFields.map((v) => vehicleRecordQueryFieldMapper(v))
        : undefined,
    };
  }

  static toAdminVehicleRecordResult(
    data: GetAllVehicleRecordsResponseDTO,
  ): AdminVehicleRecordResult {
    return {
      record_id: data.recordId,
      application_id: data.applicationId,
      vehicle_type: data.vehicleType,
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      vehicle_capacity: data.vehicleCapacity,
      registration_number: data.registrationNumber,
      registration_expiry: data.registrationExpiry,
      insurance_number: data.insuranceNumber,
      insurance_expiry: data.insuranceExpiry,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }
}

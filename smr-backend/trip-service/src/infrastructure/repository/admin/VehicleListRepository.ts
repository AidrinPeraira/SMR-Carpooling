import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListRepository";
import { VehicleList } from "#/domain/entities/ConfigurationEntities";
import { prisma } from "#/infrastructure/database/prisma";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
  HttpStatusCodes,
  VehicleTypes,
} from "@sharemyride/shared";

/**
 * This is the implementation for the the repository calss that handles
 * list of available vehicles.
 */
export class VehicleListRepository implements IVehicleListRepository {
  private readonly _model = prisma.vehicleList;

  constructor() {}

  /**
   * This method creates and saves a new vehicle in vehicle list table
   *
   * @param data : VehicleList entity without id
   * @returns VehicleList entity
   */
  async save(data: Omit<VehicleList, "id">): Promise<VehicleList> {
    const newVehicle = await this._model.create({
      data: {
        ...data,
      },
    });

    return {
      id: newVehicle.id,
      vehicleMake: newVehicle.vehicleMake,
      vehicleModel: newVehicle.vehicleModel,
      isActive: newVehicle.isActive,
      vehicleType: newVehicle.vehicleType as VehicleTypes,
    };
  }

  /**
   * This method finds all vehclels in the table
   * Note: It doesn't paginate the results. It returns "all" records
   *
   * @returns All vehicles in vehicle list table
   */
  async findAll(): Promise<VehicleList[] | null> {
    const vehicles = await this._model.findMany();

    if (!vehicles) return null;

    return vehicles.map((v) => ({
      id: v.id,
      vehicleMake: v.vehicleMake,
      vehicleModel: v.vehicleModel,
      isActive: v.isActive,
      vehicleType: v.vehicleType as VehicleTypes,
    }));
  }

  /**
   * This method finds the record that matches the given fields
   *
   * @param type  : Type of vehicle as strign
   * @param make : make of vehicle as string
   * @param model : The model of the vehicle as strinv
   * @returns matching vehicle or null
   */
  async findExistingVehicle(
    type: VehicleTypes,
    make: string,
    model: string,
  ): Promise<VehicleList | null> {
    //use the findUnique unique method instead of findFirst, since all three fields are used to make comppund index iwth unique constraing
    const vehicle = await this._model.findUnique({
      where: {
        vehicleType_vehicleMake_vehicleModel: {
          vehicleType: type as any,
          vehicleModel: model,
          vehicleMake: make,
        },
      },
    });

    if (!vehicle) return null;

    return {
      id: vehicle.id,
      vehicleMake: vehicle.vehicleMake,
      vehicleModel: vehicle.vehicleModel,
      isActive: vehicle.isActive,
      vehicleType: vehicle.vehicleType as VehicleTypes,
    };
  }

  /**
   * This method finds a record using its id and updates it.
   * It throws a custom application  error if update fails
   *
   * @param id : Id string of record to be updated
   * @param data : new updated data
   * @returns updated record
   */
  async updateById(
    id: string,
    data: Partial<VehicleList>,
  ): Promise<VehicleList> {
    const updated = await this._model.update({
      where: { id: id },
      data: {
        ...data,
        id: id,
      },
    });

    if (!updated) {
      throw new ApplicationError(
        GenericErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotModified,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.SYSTEM_DB_ERROR,
        {
          location: "VehicleList repository",
          description: "Failed to update record",
        },
      );
    }

    return {
      id: updated.id,
      vehicleMake: updated.vehicleMake,
      vehicleModel: updated.vehicleModel,
      vehicleType: updated.vehicleType as VehicleTypes,
      isActive: updated.isActive,
    };
  }
}

import {
  UpdateVehicleRequestDTO,
  UpdateVehicleResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { IUpdateVehicleUseCase } from "#/application/interfaces/use-case/admin/configurations/IUpdateVehicleUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  UpdateVehicleEvent,
  VehicleListMessages,
} from "@sharemyride/shared";

/**
 * This class implements the use case to update a particular vehicle in the
 * vehicles list configuration. It updates the store cache with the latest list and publishes an event.
 */
export class UpdateVehicleUseCase implements IUpdateVehicleUseCase {
  constructor(
    private readonly _vehiclesListRepository: IVehicleListRepository,
    private readonly _configStore: IConfigurationStore,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * This method takes the data for the updated vehicle details and updates
   * the vehicle list configurations table.
   * It also handles publishing an event and updating config store cache.
   *
   * @param data : Vehicle data to be updated
   * @returns updated vehicle's data
   */
  async execute(
    data: UpdateVehicleRequestDTO,
  ): Promise<UpdateVehicleResultDTO> {
    const updatedVehicle = await this._vehiclesListRepository.updateById(
      data.id,
      data,
    );

    if (!updatedVehicle) {
      throw new ApplicationError(
        VehicleListMessages.VEHICLE_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "UpdateVehicleUseCase",
          description: "Vehicle configuration not found for the given ID.",
        },
      );
    }

    const updatedList = await this._vehiclesListRepository.findAll();
    await this._configStore.setVehicleList(updatedList || []);

    const event: UpdateVehicleEvent = {
      eventName: EventName.ADMIN_UPDATE_NEW_VEHICLE,
      payload: {
        id: updatedVehicle.id,
        vehicleType: updatedVehicle.vehicleType,
        vehicleMake: updatedVehicle.vehicleMake,
        vehicleModel: updatedVehicle.vehicleModel,
        isActive: updatedVehicle.isActive,
      },
      timestamp: new Date(),
    };
    await this._eventBus.publish(event);

    return { vehicle: updatedVehicle };
  }
}

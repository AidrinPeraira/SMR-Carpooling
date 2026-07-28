import {
  CreateNewVehicleRequestDTO,
  CreateNewVehicleResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { ICreateNewVehicleUseCase } from "#/application/interfaces/use-case/admin/configurations/ICreateNewVehicleUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  NewVehicleEvent,
  VehicleListMessages,
} from "@sharemyride/shared";

/**
 * This class is the implementation for the use case to create new vehicles in
 * the Vehicles list.
 * It checks for existing vehicles and prevents duplicate entries
 * It updates the config store with latest vehicle settings
 * It publishes an event for the user service
 */
export class CreateNewVehicleUseCase implements ICreateNewVehicleUseCase {
  constructor(
    private readonly _vehicleListRepository: IVehicleListRepository,
    private readonly _configStore: IConfigurationStore,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * This method takes the data for new vehicle and adds a new vehicle in Vehicles List.
   * It prevents duplicate entries
   *
   * @param data : Details of new vehicle
   * @return Created data
   */
  async execute(
    data: CreateNewVehicleRequestDTO,
  ): Promise<CreateNewVehicleResultDTO> {
    const existingVehicle =
      await this._vehicleListRepository.findExistingVehicle(
        data.vehicleType,
        data.vehicleMake,
        data.vehicleModel,
      );

    if (existingVehicle) {
      throw new ApplicationError(
        VehicleListMessages.VEHICLE_EXISTS,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_ALREADY_EXISTS,
        ErrorDetails.DOMAIN_ALREADY_EXISTS,
        {
          location: "CreateNewVehicleUseCase",
          description: "Same vehicle already exists",
        },
      );
    }

    const newVehicle = await this._vehicleListRepository.save({
      ...data,
      isActive: true,
    });

    const updatedList = await this._vehicleListRepository.findAll();
    await this._configStore.setVehicleList(updatedList || []);

    //publish an event
    const event: NewVehicleEvent = {
      eventName: EventName.ADMIN_ADD_NEW_VEHICLE,
      payload: newVehicle,
      timestamp: new Date(),
    };
    this._eventBus.publish(event);

    return { vehicle: newVehicle };
  }
}

import { VehicleTypes } from "../enums";
import { DomainEvent } from "./DomainEvent";

export interface NewVehicleEventPayload {
  id: string;
  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  isActive: boolean;
}

export type NewVehicleEvent = DomainEvent<NewVehicleEventPayload>;

export interface UpdateVehicleEventPayload {
  id: string;
  vehicleType?: VehicleTypes;
  vehicleModel?: string;
  vehicleMake?: string;
  isActive?: boolean;
}

export type UpdateVehicleEvent = DomainEvent<UpdateVehicleEventPayload>;

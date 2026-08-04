import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { VehicleEntity } from "#/domain/entities/VehicleEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { VehicleStatus, VehicleTypes } from "@sharemyride/shared";

export class VehicleRepository implements IVehicleRepository {
  private readonly _model = prisma.vehicle;

  async save(
    vehicle: VehicleEntity | Omit<VehicleEntity, "vehicleId">,
  ): Promise<VehicleEntity> {
    const created = await this._model.create({
      data: {
        driverId: vehicle.driverId,
        recordId: vehicle.recordId,
        vehicleType: vehicle.vehicleType as any,
        vehicleModel: vehicle.vehicleModel,
        vehicleMake: vehicle.vehicleMake,
        vehicleCapacity: vehicle.vehicleCapacity,
        registrationNumber: vehicle.registrationNumber,
        vehicleImage: vehicle.vehicleImage,
        vehicleStatus: vehicle.vehicleStatus as any,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      },
    });

    return {
      vehicleId: created.vehicleId,
      driverId: created.driverId,
      recordId: created.recordId,
      vehicleType: created.vehicleType as VehicleTypes,
      vehicleModel: created.vehicleModel,
      vehicleMake: created.vehicleMake,
      vehicleCapacity: created.vehicleCapacity,
      registrationNumber: created.registrationNumber,
      vehicleImage: created.vehicleImage,
      vehicleStatus: created.vehicleStatus as VehicleStatus,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async updateByRegistrationNumber(
    regNumber: string,
    vehicle: Partial<VehicleEntity>,
  ): Promise<VehicleEntity> {
    const updated = await this._model.update({
      where: { registrationNumber: regNumber },
      data: {
        ...vehicle,
        vehicleType: vehicle.vehicleType as any,
        vehicleStatus: vehicle.vehicleStatus as any,
      },
    });

    return {
      vehicleId: updated.vehicleId,
      driverId: updated.driverId,
      recordId: updated.recordId,
      vehicleType: updated.vehicleType as VehicleTypes,
      vehicleModel: updated.vehicleModel,
      vehicleMake: updated.vehicleMake,
      vehicleCapacity: updated.vehicleCapacity,
      registrationNumber: updated.registrationNumber,
      vehicleImage: updated.vehicleImage,
      vehicleStatus: updated.vehicleStatus as VehicleStatus,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async findByDriverId(driverId: string): Promise<VehicleEntity[]> {
    const vehicles = await this._model.findMany({
      where: { driverId },
      orderBy: { createdAt: "desc" },
    });

    return vehicles.map((v) => ({
      vehicleId: v.vehicleId,
      driverId: v.driverId,
      recordId: v.recordId,
      vehicleType: v.vehicleType as VehicleTypes,
      vehicleModel: v.vehicleModel,
      vehicleMake: v.vehicleMake,
      vehicleCapacity: v.vehicleCapacity,
      registrationNumber: v.registrationNumber,
      vehicleImage: v.vehicleImage,
      vehicleStatus: v.vehicleStatus as VehicleStatus,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
  }
}

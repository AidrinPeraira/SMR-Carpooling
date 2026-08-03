import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { DriverEntity } from "#/domain/entities/DriverEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { DriverStatus } from "@sharemyride/shared";

export class DriverRepository implements IDriverRepository {
  private readonly _model = prisma.driver;

  async save(driver: DriverEntity): Promise<DriverEntity> {
    const created = await this._model.upsert({
      where: { driverId: driver.driverId },
      create: {
        driverId: driver.driverId,
        recordId: driver.recordId,
        licenseNumber: driver.licenseNumber,
        licenseImage: driver.licenseImage,
        driverStatus: driver.driverStatus as any,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt,
      },
      update: {
        recordId: driver.recordId,
        licenseNumber: driver.licenseNumber,
        licenseImage: driver.licenseImage,
        driverStatus: driver.driverStatus as any,
        updatedAt: driver.updatedAt,
      },
    });

    return {
      driverId: created.driverId,
      recordId: created.recordId,
      licenseNumber: created.licenseNumber,
      licenseImage: created.licenseImage,
      driverStatus: created.driverStatus as DriverStatus,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async update(
    driverId: string,
    driver: Partial<DriverEntity>,
  ): Promise<DriverEntity> {
    const updated = await this._model.update({
      where: { driverId },
      data: {
        ...driver,
        driverStatus: driver.driverStatus as any,
      },
    });

    return {
      driverId: updated.driverId,
      recordId: updated.recordId,
      licenseNumber: updated.licenseNumber,
      licenseImage: updated.licenseImage,
      driverStatus: updated.driverStatus as DriverStatus,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

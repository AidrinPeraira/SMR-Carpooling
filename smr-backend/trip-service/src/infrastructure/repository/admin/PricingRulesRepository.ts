import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { PricingRules } from "#/domain/entities/ConfigurationEntities";
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
 * This is the implementation for the pricing rules repository
 */
export class PricingRulesRepository implements IPricingRulesRepository {
  private readonly _model = prisma.pricingRules;

  constructor() {}

  /**
   * this method handles cerating a new record in the pricing repository
   *
   * @param data : PricingRules entity without id
   * @returns new pricing rule created
   */
  async save(data: Omit<PricingRules, "id">): Promise<PricingRules> {
    const created = await this._model.create({
      data: {
        vehicleType: data.vehicleType as any,
        pricePerKm: data.pricePerKm,
        basePrice: data.basePrice,
        isActive: data.isActive,
      },
    });

    return {
      id: created.id,
      vehicleType: created.vehicleType as VehicleTypes,
      pricePerKm: created.pricePerKm,
      basePrice: created.basePrice,
      isActive: created.isActive,
    };
  }

  /**
   * this method finds all pricing rules configured and returns them.
   * It doesn't paginate the results. it returns "All" the rules
   *
   * @returns all pricing rules
   */
  async findAll(): Promise<PricingRules[] | null> {
    const list = await this._model.findMany();
    if (list.length === 0) return null;

    return list.map((item) => ({
      id: item.id,
      vehicleType: item.vehicleType as VehicleTypes,
      pricePerKm: item.pricePerKm,
      basePrice: item.basePrice,
      isActive: item.isActive,
    }));
  }

  /**
   * This method finds and returns the pricing rule related to given vehicle type.
   *
   * @param vehicle type
   * @returns mathcing pricing rule
   */
  async findByVehicleType(type: VehicleTypes): Promise<PricingRules | null> {
    const result = await this._model.findUnique({
      where: { vehicleType: type as any },
    });

    if (!result) return null;

    return {
      id: result.id,
      vehicleType: result.vehicleType as VehicleTypes,
      pricePerKm: result.pricePerKm,
      basePrice: result.basePrice,
      isActive: result.isActive,
    };
  }

  /**
   * this method finds the matching pricing rule and updates it.
   *
   * @param id : record id as string
   * @param data : Updated data
   * @returns updated record
   */
  async updateById(
    id: string,
    data: Partial<PricingRules>,
  ): Promise<PricingRules> {
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
      vehicleType: updated.vehicleType as VehicleTypes,
      pricePerKm: updated.pricePerKm,
      basePrice: updated.basePrice,
      isActive: updated.isActive,
    };
  }
}

import { GetJourneyDetailsResponseDTO } from "#/application/dto/trip/ListTripsDTO";
import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { IGetJourneyDetailsUseCase } from "#/application/interfaces/use-case/trip/IGetJourneyDetailsUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * This class implements the use csae that returns
 * additional trip details before bookinga
 */
export class GetJourneyDetailsUseCase implements IGetJourneyDetailsUseCase {
  constructor(
    private readonly _tripRepository: ITripRepository,
    private readonly _pricingRepository: IPricingRulesRepository,
    private readonly _configStore: IConfigurationStore,
  ) {}
  /**
   * this method finds the trip route and other details for given
   * trip and returns the data
   */
  async execute(tripId: string): Promise<GetJourneyDetailsResponseDTO> {
    const journeyDetails =
      await this._tripRepository.findJourneyDetails(tripId);

    if (!journeyDetails) {
      throw new ApplicationError(
        "Trip not found",
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "GetJourneyDetailsUseCase",
          description: `No trip found for the given tripId: ${tripId}`,
        },
      );
    }

    const { trip, availableStops, vehicleType } = journeyDetails;

    let pricingRules = await this._configStore.getPricingRules();
    if (!pricingRules) {
      pricingRules = await this._pricingRepository.findAll();
      if (pricingRules) {
        await this._configStore.setPricingRules(pricingRules);
      }
    }

    const matchingRule = pricingRules?.find(
      (rule) => rule.vehicleType === vehicleType && rule.isActive,
    );

    return {
      tripId: trip.tripId,
      tripStops: [trip.tripOrigin, ...trip.tripStops, trip.tripDestination],
      tripRoute: [trip.tripRoute],
      availableStops: [availableStops],
      basePrice: matchingRule ? matchingRule.basePrice : 0,
      pricePerKm: matchingRule ? matchingRule.pricePerKm : 0,
    };
  }
}



export enum VehicleListMessages {
  VEHICLE_EXISTS = "Vehicle already exists.",
  VEHICLE_NOT_FOUND = "Vehicle configuration not found.",
}

export enum PricingConfigMessages {
  PRICING_EXISTS = "Pricing rule for vehicle type already exists. Please update existing pricing rules instead of creating a new entry.",
  PRICING_NOT_FOUND = "Pricing rule configuration not found.",
  INVALID_PRICING_VALUES = "Base price and rate per km must be greater than 0.",
}

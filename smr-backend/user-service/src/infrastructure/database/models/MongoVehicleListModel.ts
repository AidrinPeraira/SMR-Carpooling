import { VehicleTypes } from "@sharemyride/shared";
import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const vehicleListSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleTypes),
      required: true,
    },
    vehicleMake: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export type VehicleListDoc = HydratedDocument<
  InferSchemaType<typeof vehicleListSchema>
>;

export const MongoVehicleListModel = mongoose.model<VehicleListDoc>(
  "VehicleList",
  vehicleListSchema,
);

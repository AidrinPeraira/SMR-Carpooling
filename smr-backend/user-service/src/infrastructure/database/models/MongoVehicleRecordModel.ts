import { VehicleTypes } from "@sharemyride/shared";
import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const vehicleRecordSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  applicationId: { type: String, required: true },
  vehicleType: {
    type: String,
    enum: Object.values(VehicleTypes),
    required: true,
  },
  vehicleMake: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleCapacity: { type: Number, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  registrationExpiry: { type: Date, required: true },
  registrationFile: { type: String, required: true },
  insuranceNumber: { type: String },
  insuranceExpiry: { type: Date, required: true },
  insuranceFile: { type: String, required: true },
  vehicleImage: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export type VehicleRecordDoc = HydratedDocument<
  InferSchemaType<typeof vehicleRecordSchema>
>;

export const VehicleRecordModel = mongoose.model<VehicleRecordDoc>(
  "VehicleRecord",
  vehicleRecordSchema,
);

import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const driverRecordSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  applicationId: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseExpiry: { type: Date, required: true },
  licenseFile: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export type DriverRecordDoc = HydratedDocument<
  InferSchemaType<typeof driverRecordSchema>
>;

export const DriverRecordModel = mongoose.model<DriverRecordDoc>(
  "DriverRecord",
  driverRecordSchema,
);

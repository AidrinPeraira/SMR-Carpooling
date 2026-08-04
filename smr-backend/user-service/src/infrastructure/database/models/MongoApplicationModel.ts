import { ApplicationStatus, ApplicationType } from "@sharemyride/shared";
import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

const adminCommentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  adminId: { type: String, required: true },
  time: { type: Date, required: true },
});

export const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  applicationType: {
    type: String,
    enum: Object.values(ApplicationType),
    required: true,
  },
  applicationStatus: {
    type: String,
    enum: Object.values(ApplicationStatus),
    required: true,
    default: ApplicationStatus.PENDING,
  },
  adminComments: [adminCommentSchema],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export type ApplicationDoc = HydratedDocument<InferSchemaType<typeof applicationSchema>>;

export const ApplicationModel = mongoose.model<ApplicationDoc>(
  "Application",
  applicationSchema,
);

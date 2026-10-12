import mongoose, { Schema, Document, Model } from "mongoose";

export interface JourneyMemberDoc {
  memberId: string;
  shareToken?: string;
}

export interface JourneyDoc extends Document {
  journeyId: string;
  driverId: string;
  members: JourneyMemberDoc[];
  isActive: boolean;
}

const journeyMemberSchema = new Schema<JourneyMemberDoc>(
  {
    memberId: { type: String, required: true },
    shareToken: { type: String },
  },
  { _id: false },
);

const journeySchema = new Schema<JourneyDoc>(
  {
    journeyId: { type: String, required: true, unique: true },
    driverId: { type: String, required: true },
    members: { type: [journeyMemberSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const JourneyModel: Model<JourneyDoc> = mongoose.model<JourneyDoc>(
  "Journey",
  journeySchema,
);

import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
  },
});

export type MemberDoc = HydratedDocument<InferSchemaType<typeof memberSchema>>;

export const MemberModel = mongoose.model<MemberDoc>("Member", memberSchema);

import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const callSessionSchema = new mongoose.Schema({
  callSessionId: {
    type: String,
    required: true,
  },

  callerId: {
    type: String,
    required: true,
  },

  receiverId: {
    type: String,
    required: true,
  },

  callStatus: {
    type: String,
    required: true,
  },

  joinedAt: {
    type: Date,
    required: true,
  },

  leftAt: {
    type: Date,
  },
});

export type CallSessionDoc = HydratedDocument<InferSchemaType<typeof callSessionSchema>>;

export const CallSessionModel = mongoose.model<CallSessionDoc>("CallSession", callSessionSchema);

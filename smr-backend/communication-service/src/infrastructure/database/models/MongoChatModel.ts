import mongoose, { Schema, Document, Model } from "mongoose";

export interface ChatDoc extends Document {
  chatId: string;
  tripId: string;
  isActive: boolean;
  members: string[];
}

const chatSchema = new Schema<ChatDoc>(
  {
    chatId: { type: String, required: true, unique: true },
    tripId: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    members: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const ChatModel: Model<ChatDoc> = mongoose.model<ChatDoc>("Chat", chatSchema);

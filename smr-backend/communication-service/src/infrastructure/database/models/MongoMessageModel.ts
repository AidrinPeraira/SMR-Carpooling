import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type MessageDoc = HydratedDocument<InferSchemaType<typeof messageSchema>>;

export const MessageModel = mongoose.model<MessageDoc>("Message", messageSchema);

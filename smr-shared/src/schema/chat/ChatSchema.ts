import * as z from "zod";

export const JoinTripChatSchema = z.object({
  trip_id: z.string().min(1),
});

export type JoinTripChatSchemaType = z.infer<typeof JoinTripChatSchema>;

export const LeaveTripChatSchema = z.object({
  chat_id: z.string().min(1),
});

export type LeaveTripChatSchemaType = z.infer<typeof LeaveTripChatSchema>;

export const SendChatMessageSchema = z.object({
  chat_id: z.string().min(1),
  body: z.string().min(1),
});

export type SendChatMessageSchemaType = z.infer<typeof SendChatMessageSchema>;

export const SyncChatMessagesSchema = z.object({
  trip_id: z.string().min(1),
});

export type SyncChatMessagesSchemaType = z.infer<typeof SyncChatMessagesSchema>;

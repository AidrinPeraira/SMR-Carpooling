import * as z from "zod";

export const InitiateCallSchema = z.object({
  trip_id: z.string().min(1),
  receiver_id: z.string().min(1),
});

export type InitiateCallSchemaType = z.infer<typeof InitiateCallSchema>;

export const AcceptCallSchema = z.object({
  call_session_id: z.string().min(1),
});

export type AcceptCallSchemaType = z.infer<typeof AcceptCallSchema>;

export const RejectCallSchema = z.object({
  call_session_id: z.string().min(1),
});

export type RejectCallSchemaType = z.infer<typeof RejectCallSchema>;

export const HandleCallTimeoutSchema = z.object({
  call_session_id: z.string().min(1),
});

export type HandleCallTimeoutSchemaType = z.infer<
  typeof HandleCallTimeoutSchema
>;

export const EndCallSchema = z.object({
  call_session_id: z.string().min(1),
});

export type EndCallSchemaType = z.infer<typeof EndCallSchema>;

export const RelayCallSignalSchema = z.object({
  call_session_id: z.string().min(1),
  signal_type: z.string().min(1),
  signal_data: z.unknown(),
});

export type RelayCallSignalSchemaType = z.infer<typeof RelayCallSignalSchema>;

import * as z from "zod";

export const DriverJoinJourneySchema = z.object({
  journey_id: z.string().min(1),
});

export type DriverJoinJourneySchemaType = z.infer<
  typeof DriverJoinJourneySchema
>;

export const PassengerJoinJourneySchema = z.object({
  journey_id: z.string().min(1),
});

export type PassengerJoinJourneySchemaType = z.infer<
  typeof PassengerJoinJourneySchema
>;

export const ShareTokenJoinJourneySchema = z.object({
  journey_id: z.string().min(1),
  share_token: z.string().min(1),
});

export type ShareTokenJoinJourneySchemaType = z.infer<
  typeof ShareTokenJoinJourneySchema
>;

export const UpdateLocationSchema = z.object({
  journey_id: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  heading: z.number(),
  speed: z.number(),
  timestamp: z.number(),
});

export type UpdateLocationSchemaType = z.infer<typeof UpdateLocationSchema>;

export const LeaveJourneySchema = z.object({
  journey_id: z.string().min(1),
});

export type LeaveJourneySchemaType = z.infer<typeof LeaveJourneySchema>;

export const GetShareTokenSchema = z.object({
  journey_id: z.string().min(1),
});

export type GetShareTokenSchemaType = z.infer<typeof GetShareTokenSchema>;

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

export const DriverArrivedSchema = z.object({
  journey_id: z.string().min(1),
  passenger_id: z.string().min(1),
  stop_type: z.enum(["pickup", "dropoff"]),
  arrived_lat: z.number(),
  arrived_lng: z.number(),
});

export type DriverArrivedSchemaType = z.infer<typeof DriverArrivedSchema>;

export const DriverVerifyPickupSchema = z.object({
  journey_id: z.string().min(1),
  passenger_id: z.string().min(1),
  pickup_otp: z.string().length(4),
});

export type DriverVerifyPickupSchemaType = z.infer<
  typeof DriverVerifyPickupSchema
>;

export const PassengerConfirmPickupSchema = z.object({
  journey_id: z.string().min(1),
});

export type PassengerConfirmPickupSchemaType = z.infer<
  typeof PassengerConfirmPickupSchema
>;

export const DriverDropOffPassengerSchema = z.object({
  journey_id: z.string().min(1),
  passenger_id: z.string().min(1),
  drop_off_lat: z.number(),
  drop_off_lng: z.number(),
});

export type DriverDropOffPassengerSchemaType = z.infer<
  typeof DriverDropOffPassengerSchema
>;

export const PassengerConfirmDropOffSchema = z.object({
  journey_id: z.string().min(1),
  drop_off_lat: z.number(),
  drop_off_lng: z.number(),
});

export type PassengerConfirmDropOffSchemaType = z.infer<
  typeof PassengerConfirmDropOffSchema
>;

export const PassengerNoShowSchema = z.object({
  journey_id: z.string().min(1),
  passenger_id: z.string().min(1),
});

export type PassengerNoShowSchemaType = z.infer<typeof PassengerNoShowSchema>;

import * as z from "zod";
import { QuerySchema } from "../query/QuerySchema";

export const TripStopSchema = z.object({
  stop_lat: z.number(),
  stop_lng: z.number(),
  stop_name: z.string().min(1),
  stop_address: z.string().min(1),
});

export type TripStopSchemaType = z.infer<typeof TripStopSchema>;

export const CreateTripSchema = z.object({
  vehicle_id: z.string().min(1),
  trip_origin: TripStopSchema,
  trip_destination: TripStopSchema,
  trip_stops: z.array(TripStopSchema),
  trip_route: z.array(z.tuple([z.number(), z.number()])),
  trip_distance: z.number().nonnegative(),
  available_seats: z.number().int().positive(),
  trip_tags: z.array(z.string()),
  start_time: z.coerce.date(),
  total_seats: z.number().int().positive(),
});

export type CreateTripSchemaType = z.infer<typeof CreateTripSchema>;

export const SearchTripSchema = z.object({
  origin: TripStopSchema,
  destination: TripStopSchema,
  time: z.coerce.date(),
  query: QuerySchema.optional(),
});

export type SearchTripSchemaType = z.infer<typeof SearchTripSchema>;

import * as z from "zod";

export const ChangeUserStatusSchema = z.object({
  userId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{32}$/, "Invalid user ID"),
});

export const ChangeUserStatusScheam = ChangeUserStatusSchema;


import * as z from "zod";

export const UpdateUserSchema = z.object({
  user_id: z.string().trim().min(2),

  password: z.string().trim().min(2),

  first_name: z
    .string({ error: "First name is required" })
    .trim()
    .min(2, { message: "First name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First name can only contain letters and spaces",
    })
    .optional(),

  last_name: z
    .string({ error: "Last name is required" })
    .trim()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name can only contain letters and spaces",
    })
    .optional(),

  phone_number: z
    .string({ error: "Phone number is required" })
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[6-9]\d{9}$/, { message: "Invalid phone number format" })
    .optional(),

  profile_image: z.url({ message: "Invalid URL format" }).optional(),
});

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

import * as z from "zod";

export const SignUpUserBaseSchema = z.object({
  first_name: z
    .string({ error: "First name is required" })
    .trim()
    .min(2, { message: "First name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First name can only contain letters and spaces",
    }),

  last_name: z
    .string({ error: "Last name is required" })
    .trim()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name can only contain letters and spaces",
    }),

  email_id: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .min(5, { message: "Email is too short" })
    .max(255, { message: "Email is too long" })
    .regex(
      /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]{3,})[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
      { message: "Email is of invalid format." },
    ),

  phone_number: z
    .string({ error: "Phone number is required" })
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[6-9]\d{9}$/, { message: "Invalid phone number format" }),

  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
    .regex(/[0-9]/, { message: "Password must include a number" })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, {
      message: "Password must include a special character",
    })
    .regex(/^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, {
      message: "Password contains invalid characters",
    }),

  confirm_password: z.string({ error: "Please confirm your password" }).trim(),
});

export const SignUpUserSchema = SignUpUserBaseSchema.refine(
  (data) => data.password === data.confirm_password,
  {
    path: ["confirm_password"],
    message: "Passwords do not match",
  },
);

export type SignUpUserSchemaType = z.infer<typeof SignUpUserSchema>;

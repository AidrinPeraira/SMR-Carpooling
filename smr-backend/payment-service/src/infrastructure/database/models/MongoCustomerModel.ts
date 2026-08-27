import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

export const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  emailId: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
  },
});

export type CustomerDoc = HydratedDocument<
  InferSchemaType<typeof customerSchema>
>;

export const CustomerModel = mongoose.model<CustomerDoc>(
  "Customer",
  customerSchema,
);

import { AccountStatus, UserRole } from "@sharemyride/shared";
import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

const tokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
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

  phoneNumber: {
    type: String,
    required: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String,
  },

  userRole: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.PASSENGER,
  },

  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },

  isDriver: {
    type: Boolean,
    required: true,
    default: false,
  },

  accountStatus: {
    type: String,
    enum: Object.values(AccountStatus),
    required: true,
    default: AccountStatus.PENDING_VERIFICATION,
  },

  verificationToken: tokenSchema,

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
  },
});

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>;

export const UserModel = mongoose.model<UserDoc>("User", userSchema);

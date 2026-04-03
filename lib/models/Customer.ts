import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface ICustomer extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  addresses: IAddress[];
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  fullName: string;
}

const AddressSchema = new Schema<IAddress>(
  {
    label:        { type: String, trim: true, default: "Home" },
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    phone:        { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city:         { type: String, required: true, trim: true },
    state:        { type: String, required: true, trim: true },
    country:      { type: String, required: true, trim: true, default: "Nigeria" },
    postalCode:   { type: String, trim: true },
    isDefault:    { type: Boolean, default: false },
  },
  { _id: true }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:    { type: String, required: true },
    firstName:       { type: String, required: true, trim: true },
    lastName:        { type: String, required: true, trim: true },
    phone:           { type: String, trim: true },
    dateOfBirth:     { type: Date },
    addresses:       { type: [AddressSchema], default: [] },
    totalOrders:     { type: Number, default: 0 },
    totalSpent:      { type: Number, default: 0 },
    isActive:        { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLoginAt:     { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

CustomerSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

CustomerSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

CustomerSchema.index({ email: 1 });
CustomerSchema.index({ isActive: 1 });

export const Customer: Model<ICustomer> =
  mongoose.models.Customer ?? mongoose.model<ICustomer>("Customer", CustomerSchema);
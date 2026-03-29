import mongoose, { Model, Schema, Types } from "mongoose";

export interface IAddress {
  customerId: Types.ObjectId;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    label: { type: String, default: "Home" },
    fullName: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "Nigeria" },
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Address: Model<IAddress> = mongoose.models.Address ?? mongoose.model<IAddress>("Address", AddressSchema);

import mongoose, { Schema } from "mongoose";
const AddressSchema = new Schema({ customerEmail: String, label: String, line1: String, city: String, state: String, country: String }, { timestamps: true });
export const Address = mongoose.models.Address ?? mongoose.model("Address", AddressSchema);

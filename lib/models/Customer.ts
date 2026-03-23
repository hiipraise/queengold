import mongoose, { Schema } from "mongoose";
const CustomerSchema = new Schema({ name: String, email: { type: String, unique: true }, tier: String, addresses: [{ label: String, line1: String, city: String, state: String, country: String }] }, { timestamps: true });
export const Customer = mongoose.models.Customer ?? mongoose.model("Customer", CustomerSchema);

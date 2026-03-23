import mongoose, { Schema } from "mongoose";
const OrderSchema = new Schema({ orderNumber: { type: String, unique: true }, customerEmail: String, items: [{ slug: String, quantity: Number, unitPrice: Number }], total: Number, status: String, paymentStatus: String, paymentReference: String, address: { line1: String, city: String, state: String, country: String } }, { timestamps: true });
export const Order = mongoose.models.Order ?? mongoose.model("Order", OrderSchema);

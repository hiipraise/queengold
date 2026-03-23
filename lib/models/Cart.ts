import mongoose, { Schema } from "mongoose";
const CartSchema = new Schema({ customerEmail: String, items: [{ slug: String, quantity: Number }], subtotal: Number, currency: { type: String, default: 'USD' } }, { timestamps: true });
export const Cart = mongoose.models.Cart ?? mongoose.model("Cart", CartSchema);

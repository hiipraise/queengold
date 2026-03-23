import mongoose, { Schema } from "mongoose";
const PaymentSchema = new Schema({ orderNumber: String, provider: { type: String, default: 'Squad' }, transactionRef: String, amount: Number, currency: { type: String, default: 'USD' }, status: String, payload: Schema.Types.Mixed }, { timestamps: true });
export const Payment = mongoose.models.Payment ?? mongoose.model("Payment", PaymentSchema);

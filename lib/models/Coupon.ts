import mongoose, { Schema } from "mongoose";
const CouponSchema = new Schema({ code: { type: String, unique: true }, title: String, detail: String, percentageOff: Number, active: Boolean }, { timestamps: true });
export const Coupon = mongoose.models.Coupon ?? mongoose.model("Coupon", CouponSchema);

import mongoose, { Model, Schema } from "mongoose";

export interface ICoupon {
  code: string;
  discountType: "percentage" | "flat";
  value: number;
  active: boolean;
  startsAt?: Date;
  endsAt?: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, uppercase: true, unique: true, required: true },
    discountType: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
  },
  { timestamps: true },
);

export const Coupon: Model<ICoupon> = mongoose.models.Coupon ?? mongoose.model<ICoupon>("Coupon", CouponSchema);

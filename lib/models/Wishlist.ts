import mongoose, { Schema, Model } from "mongoose";

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface IWishlist {
  _id?: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

WishlistSchema.index({ customer: 1 });

export const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist ?? mongoose.model<IWishlist>("Wishlist", WishlistSchema);

// ─── Coupon ───────────────────────────────────────────────────────────────────
export type CouponType = "percentage" | "fixed";

export interface ICoupon {
  _id?: mongoose.Types.ObjectId;
  code: string;
  type: CouponType;
  value: number; // percentage (0–100) or fixed amount in kobo
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code:             { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:             { type: String, enum: ["percentage", "fixed"], required: true },
    value:            { type: Number, required: true, min: 0 },
    minOrderAmount:   { type: Number, default: 0 },
    maxDiscountAmount:{ type: Number },
    usageLimit:       { type: Number },
    usageCount:       { type: Number, default: 0 },
    isActive:         { type: Boolean, default: true },
    expiresAt:        { type: Date },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1 });

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon ?? mongoose.model<ICoupon>("Coupon", CouponSchema);
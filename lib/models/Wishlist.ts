import mongoose, { Model, Schema, Types } from "mongoose";

export interface IWishlist {
  customerId: Types.ObjectId;
  productIds: Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlist>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", unique: true, required: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

export const Wishlist: Model<IWishlist> = mongoose.models.Wishlist ?? mongoose.model<IWishlist>("Wishlist", WishlistSchema);

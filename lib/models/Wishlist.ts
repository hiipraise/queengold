import mongoose, { Schema } from "mongoose";
const WishlistSchema = new Schema({ customerEmail: String, productSlugs: [String] }, { timestamps: true });
export const Wishlist = mongoose.models.Wishlist ?? mongoose.model("Wishlist", WishlistSchema);

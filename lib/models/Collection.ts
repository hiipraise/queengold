import mongoose, { Model, Schema, Types } from "mongoose";

export interface ICollection {
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  featuredProductIds: Types.ObjectId[];
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    featuredProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

export const Collection: Model<ICollection> = mongoose.models.Collection ?? mongoose.model<ICollection>("Collection", CollectionSchema);

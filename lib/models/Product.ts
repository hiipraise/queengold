import mongoose, { Model, Schema, Types } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  categoryId: Types.ObjectId;
  collectionIds: Types.ObjectId[];
  gender: "men" | "women" | "unisex";
  type: "classic" | "sport" | "luxury" | "limited-edition" | "signature";
  specs: Record<string, string>;
  movementDetails: string;
  materialDetails: string;
  warrantyInfo: string;
  watchSerialPrefix?: string;
  featuredFlags: {
    featured: boolean;
    newArrival: boolean;
    bestSeller: boolean;
    limited: boolean;
  };
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    discountPrice: Number,
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    collectionIds: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    gender: { type: String, enum: ["men", "women", "unisex"], required: true },
    type: { type: String, enum: ["classic", "sport", "luxury", "limited-edition", "signature"], required: true },
    specs: { type: Map, of: String, default: {} },
    movementDetails: { type: String, default: "" },
    materialDetails: { type: String, default: "" },
    warrantyInfo: { type: String, default: "International 5-year warranty" },
    watchSerialPrefix: String,
    featuredFlags: {
      featured: { type: Boolean, default: false },
      newArrival: { type: Boolean, default: false },
      bestSeller: { type: Boolean, default: false },
      limited: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export const Product: Model<IProduct> = mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

import mongoose, { Model, Schema } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description: string;
  gender: "men" | "women" | "unisex";
  type: "classic" | "sport" | "luxury" | "limited-edition" | "signature" | "new-arrivals" | "best-sellers";
  heroImage: string;
  isFeatured: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    gender: { type: String, enum: ["men", "women", "unisex"], required: true },
    type: {
      type: String,
      enum: ["classic", "sport", "luxury", "limited-edition", "signature", "new-arrivals", "best-sellers"],
      required: true,
    },
    heroImage: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Category: Model<ICategory> = mongoose.models.Category ?? mongoose.model<ICategory>("Category", CategorySchema);

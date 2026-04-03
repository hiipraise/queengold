import mongoose, { Schema, Model } from "mongoose";

export interface ICollection {
  _id?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  coverImage: string;
  images: string[];
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  launchDate?: Date;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name:           { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline:        { type: String, required: true, trim: true, maxlength: 160 },
    description:    { type: String },
    coverImage:     { type: String, required: true },
    images:         { type: [String], default: [] },
    sortOrder:      { type: Number, default: 0 },
    isActive:       { type: Boolean, default: true },
    isFeatured:     { type: Boolean, default: false },
    launchDate:     { type: Date },
    metaTitle:      { type: String },
    metaDescription:{ type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

CollectionSchema.index({ slug: 1 });
CollectionSchema.index({ isActive: 1, isFeatured: 1 });

export const Collection: Model<ICollection> =
  mongoose.models.Collection ?? mongoose.model<ICollection>("Collection", CollectionSchema);
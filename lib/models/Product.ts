import mongoose, { Schema, Model } from "mongoose";

export type ProductStatus = "active" | "draft" | "archived";
export type ProductGender = "men" | "women" | "unisex";

export interface IProductSpecifications {
  movement: string;
  caseMaterial: string;
  caseSize: string;
  dialColor: string;
  bracelet: string;
  waterResistance: string;
  crystalType: string;
  powerReserve?: string;
  functions?: string;
  lugWidth?: string;
  thickness?: string;
}

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  images: string[];
  thumbnailImage: string;
  category: mongoose.Types.ObjectId;
  collections: mongoose.Types.ObjectId[];
  tags: string[];
  gender: ProductGender;
  specifications: IProductSpecifications;
  warrantyYears: number;
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  status: ProductStatus;
  weight?: number;
  metaTitle?: string;
  metaDescription?: string;
  sortOrder: number;
  viewCount: number;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SpecificationsSchema = new Schema<IProductSpecifications>(
  {
    movement:       { type: String, required: true, trim: true },
    caseMaterial:   { type: String, required: true, trim: true },
    caseSize:       { type: String, required: true, trim: true },
    dialColor:      { type: String, required: true, trim: true },
    bracelet:       { type: String, required: true, trim: true },
    waterResistance:{ type: String, required: true, trim: true },
    crystalType:    { type: String, required: true, trim: true },
    powerReserve:   { type: String },
    functions:      { type: String },
    lugWidth:       { type: String },
    thickness:      { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:      { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    price:            { type: Number, required: true, min: 0 },
    comparePrice:     { type: Number, min: 0, default: null },
    images:           { type: [String], default: [] },
    thumbnailImage:   { type: String, required: true },
    category:         { type: Schema.Types.ObjectId, ref: "Category", required: true },
    collections:      [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    tags:             { type: [String], default: [] },
    gender:           { type: String, enum: ["men", "women", "unisex"], default: "unisex" },
    specifications:   { type: SpecificationsSchema, required: true },
    warrantyYears:    { type: Number, default: 2 },
    stock:            { type: Number, required: true, min: 0, default: 0 },
    sku:              { type: String, required: true, unique: true, trim: true },
    isFeatured:       { type: Boolean, default: false },
    isNewArrival:     { type: Boolean, default: false },
    isBestSeller:     { type: Boolean, default: false },
    isLimitedEdition: { type: Boolean, default: false },
    status:           { type: String, enum: ["active", "draft", "archived"], default: "draft" },
    weight:           { type: Number },
    metaTitle:        { type: String },
    metaDescription:  { type: String },
    sortOrder:        { type: Number, default: 0 },
    viewCount:        { type: Number, default: 0 },
    purchaseCount:    { type: Number, default: 0 },
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

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ collections: 1 });
ProductSchema.index({ status: 1, isFeatured: 1 });
ProductSchema.index({ status: 1, isNewArrival: 1 });
ProductSchema.index({ status: 1, isBestSeller: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });

ProductSchema.virtual("isOnSale").get(function () {
  return this.comparePrice != null && this.comparePrice > this.price;
});

ProductSchema.virtual("discountPercent").get(function () {
  if (!this.comparePrice || this.comparePrice <= this.price) return 0;
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

export const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);
import mongoose, { Schema } from "mongoose";
const CollectionSchema = new Schema({ name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, tagline: String, description: String, featured: { type: Boolean, default: false } }, { timestamps: true });
export const Collection = mongoose.models.Collection ?? mongoose.model("Collection", CollectionSchema);

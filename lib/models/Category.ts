import mongoose, { Schema } from "mongoose";
const CategorySchema = new Schema({ name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, description: String, featured: { type: Boolean, default: false } }, { timestamps: true });
export const Category = mongoose.models.Category ?? mongoose.model("Category", CategorySchema);

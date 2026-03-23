import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { categories, collections, customer, products, promotions } from "../lib/site-data";

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@queengold.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe@2025!";
if (!MONGODB_URI) throw new Error("MONGODB_URI is required.");

const WatchSchema = new mongoose.Schema({ serialNumber: { type: String, unique: true }, model: String, collection: String, movement: String, status: String, warrantyStatus: String, dateOfPurchase: Date, dealer: String, scanCount: Number, firstScannedAt: Date, lastScannedAt: Date }, { timestamps: true });
const AdminSchema = new mongoose.Schema({ email: { type: String, unique: true }, passwordHash: String, name: String, role: String }, { timestamps: true });
const ProductSchema = new mongoose.Schema({ slug: { type: String, unique: true }, name: String, sku: String, serialNumber: String, price: Number, discountPercentage: Number, stock: Number, category: String, collection: String, description: String, story: String, specs: [{ label: String, value: String }], movement: String, material: String, warranty: String, badge: String, featured: Boolean, bestSeller: Boolean, newArrival: Boolean, images: [String] }, { timestamps: true });
const CategorySchema = new mongoose.Schema({ slug: { type: String, unique: true }, name: String, description: String }, { timestamps: true });
const CollectionSchema = new mongoose.Schema({ slug: { type: String, unique: true }, name: String, tagline: String, description: String }, { timestamps: true });
const CustomerSchema = new mongoose.Schema({ email: { type: String, unique: true }, name: String, tier: String, addresses: [{ label: String, line1: String, city: String, state: String, country: String }] }, { timestamps: true });
const CouponSchema = new mongoose.Schema({ code: { type: String, unique: true }, title: String, detail: String }, { timestamps: true });

const Watch = mongoose.models.Watch ?? mongoose.model("Watch", WatchSchema);
const Admin = mongoose.models.Admin ?? mongoose.model("Admin", AdminSchema);
const Product = mongoose.models.Product ?? mongoose.model("Product", ProductSchema);
const Category = mongoose.models.Category ?? mongoose.model("Category", CategorySchema);
const Collection = mongoose.models.Collection ?? mongoose.model("Collection", CollectionSchema);
const Customer = mongoose.models.Customer ?? mongoose.model("Customer", CustomerSchema);
const Coupon = mongoose.models.Coupon ?? mongoose.model("Coupon", CouponSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (!existing) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({ email: ADMIN_EMAIL.toLowerCase(), passwordHash, name: "Queen Gold Admin", role: "superadmin" });
  }
  for (const category of categories) await Category.updateOne({ slug: category.slug }, category, { upsert: true });
  for (const collection of collections) await Collection.updateOne({ slug: collection.slug }, collection, { upsert: true });
  for (const product of products) {
    await Product.updateOne({ slug: product.slug }, product, { upsert: true });
    await Watch.updateOne({ serialNumber: product.serialNumber }, { serialNumber: product.serialNumber, model: product.sku, collection: product.collection, movement: product.movement, status: product.stock > 1 ? "registered" : "sold", warrantyStatus: "active", dealer: "Queen Gold Lagos", dateOfPurchase: new Date("2026-01-15"), scanCount: 0 }, { upsert: true });
  }
  await Customer.updateOne({ email: customer.email }, customer, { upsert: true });
  for (const promo of promotions) await Coupon.updateOne({ code: promo.code }, promo, { upsert: true });
  console.log(`Seeded ${products.length} products, ${categories.length} categories, ${collections.length} collections.`);
  await mongoose.disconnect();
}
seed().catch((error) => { console.error(error); process.exit(1); });

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@queengold.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe@2025!";

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not set in environment.");
  process.exit(1);
}

const CategorySchema = new mongoose.Schema({ name: String, slug: { type: String, unique: true }, description: String, gender: String, type: String, heroImage: String, isFeatured: Boolean }, { timestamps: true });
const CollectionSchema = new mongoose.Schema({ name: String, slug: { type: String, unique: true }, description: String, bannerImage: String }, { timestamps: true });
const ProductSchema = new mongoose.Schema({ name: String, slug: { type: String, unique: true }, sku: { type: String, unique: true }, shortDescription: String, description: String, price: Number, discountPrice: Number, stock: Number, images: [String], categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, collectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }], gender: String, type: String, specs: { type: Map, of: String }, movementDetails: String, materialDetails: String, warrantyInfo: String, featuredFlags: { featured: Boolean, newArrival: Boolean, bestSeller: Boolean, limited: Boolean } }, { timestamps: true });
const WatchSchema = new mongoose.Schema({ serialNumber: { type: String, unique: true }, model: String, collection: String, movement: String, status: String, warrantyStatus: String, dateOfPurchase: Date, dealer: String, scanCount: Number, firstScannedAt: Date, lastScannedAt: Date }, { timestamps: true });
const AdminSchema = new mongoose.Schema({ email: { type: String, unique: true }, passwordHash: String, name: String, role: String }, { timestamps: true });

const Category = mongoose.models.Category ?? mongoose.model("Category", CategorySchema);
const Collection = mongoose.models.Collection ?? mongoose.model("Collection", CollectionSchema);
const Product = mongoose.models.Product ?? mongoose.model("Product", ProductSchema);
const Watch = mongoose.models.Watch ?? mongoose.model("Watch", WatchSchema);
const Admin = mongoose.models.Admin ?? mongoose.model("Admin", AdminSchema);

const CATEGORIES = [
  ["Men’s Watches", "mens-watches", "men", "luxury"],
  ["Women’s Watches", "womens-watches", "women", "classic"],
  ["Unisex", "unisex", "unisex", "sport"],
  ["Classic", "classic", "unisex", "classic"],
  ["Sport", "sport", "unisex", "sport"],
  ["Luxury", "luxury", "unisex", "luxury"],
  ["Limited Edition", "limited-edition", "unisex", "limited-edition"],
  ["New Arrivals", "new-arrivals", "unisex", "new-arrivals"],
  ["Best Sellers", "best-sellers", "unisex", "best-sellers"],
  ["Signature Collection", "signature-collection", "unisex", "signature"],
];

const COLLECTIONS = [
  ["Imperial Legacy", "imperial-legacy", "Polished gold architecture with modern precision."],
  ["Aurum Sport", "aurum-sport", "High-performance chronographs for active luxury."],
  ["Noir Signature", "noir-signature", "Black-gold aesthetics for private collectors."],
];

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });

  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (!existingAdmin) {
    await Admin.create({ email: ADMIN_EMAIL.toLowerCase(), passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12), name: "Queen Gold Admin", role: "superadmin" });
  }

  const categoryMap = new Map<string, any>();
  for (const [name, slug, gender, type] of CATEGORIES) {
    const c = await Category.findOneAndUpdate({ slug }, { name, slug, gender, type, description: `${name} collection`, isFeatured: true }, { upsert: true, new: true });
    categoryMap.set(slug as string, c);
  }

  const collectionMap = new Map<string, any>();
  for (const [name, slug, description] of COLLECTIONS) {
    const c = await Collection.findOneAndUpdate({ slug }, { name, slug, description }, { upsert: true, new: true });
    collectionMap.set(slug as string, c);
  }

  const catalog = [
    { name: "Sovereign Chronometer 41", slug: "sovereign-chronometer-41", sku: "QG-SC-041", price: 5200000, discountPrice: 4850000, stock: 7, gender: "men", type: "luxury", category: "mens-watches", collection: "imperial-legacy", flags: { featured: true, newArrival: false, bestSeller: true, limited: false } },
    { name: "Seraphine Moonphase 36", slug: "seraphine-moonphase-36", sku: "QG-SM-036", price: 4700000, stock: 9, gender: "women", type: "classic", category: "womens-watches", collection: "imperial-legacy", flags: { featured: true, newArrival: true, bestSeller: true, limited: false } },
    { name: "Regatta Titanium Diver", slug: "regatta-titanium-diver", sku: "QG-RT-042", price: 3900000, stock: 12, gender: "unisex", type: "sport", category: "sport", collection: "aurum-sport", flags: { featured: true, newArrival: true, bestSeller: false, limited: false } },
    { name: "Noir Crown Tourbillon", slug: "noir-crown-tourbillon", sku: "QG-NC-040", price: 8750000, stock: 3, gender: "unisex", type: "limited-edition", category: "limited-edition", collection: "noir-signature", flags: { featured: true, newArrival: false, bestSeller: false, limited: true } },
  ];

  for (const item of catalog) {
    await Product.findOneAndUpdate(
      { slug: item.slug },
      {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        shortDescription: "Hand-finished Swiss movement with Queen Gold signature detailing.",
        description: `${item.name} blends fine watchmaking with bold luxury craftsmanship for discerning collectors.`,
        price: item.price,
        discountPrice: item.discountPrice,
        stock: item.stock,
        images: [
          "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop",
        ],
        categoryId: categoryMap.get(item.category)?._id,
        collectionIds: [collectionMap.get(item.collection)?._id],
        gender: item.gender,
        type: item.type,
        specs: { caseSize: "41mm", waterResistance: "100m", crystal: "Sapphire", caliber: "CROWNCALIBRE CC-01" },
        movementDetails: "Automatic Swiss movement with 72-hour reserve.",
        materialDetails: "18k gold bezel, brushed titanium case, alligator leather strap.",
        warrantyInfo: "5-year Queen Gold international warranty with digital passport support.",
        featuredFlags: item.flags,
      },
      { upsert: true, new: true },
    );
  }

  await Watch.findOneAndUpdate({ serialNumber: "Q04R7254" }, { serialNumber: "Q04R7254", model: "QG-SC-041", collection: "Imperial Legacy", movement: "CROWNCALIBRE™ CC-01", status: "sold", warrantyStatus: "active", dateOfPurchase: new Date("2025-11-12"), dealer: "Queen Gold Lagos", scanCount: 2, firstScannedAt: new Date("2025-11-14"), lastScannedAt: new Date("2026-01-03") }, { upsert: true });
  await Watch.findOneAndUpdate({ serialNumber: "Q04R7255" }, { serialNumber: "Q04R7255", model: "QG-SM-036", collection: "Imperial Legacy", movement: "CROWNCALIBRE™ CC-02", status: "registered", warrantyStatus: "active", dealer: "Queen Gold Lagos", scanCount: 1, firstScannedAt: new Date("2026-02-05"), lastScannedAt: new Date("2026-02-05") }, { upsert: true });

  await mongoose.disconnect();
  console.log("Seed completed successfully.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

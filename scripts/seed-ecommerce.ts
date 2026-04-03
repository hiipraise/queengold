/**
 * Ecommerce seed script — run after the base seed.
 *
 * Usage:
 *   npx tsx scripts/seed-ecommerce.ts
 */

import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) { console.error("MONGODB_URI not set"); process.exit(1); }

// ─── Inline schemas ──────────────────────────────────────────────────────────

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, description: String, image: String,
  sortOrder: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CollectionSchema = new mongoose.Schema({
  name: String, slug: String, tagline: String, description: String,
  coverImage: String, images: [String],
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  launchDate: Date,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String, slug: String, description: String, shortDescription: String,
  price: Number, comparePrice: Number,
  images: [String], thumbnailImage: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: [String], gender: String,
  specifications: {
    movement: String, caseMaterial: String, caseSize: String,
    dialColor: String, bracelet: String, waterResistance: String,
    crystalType: String, powerReserve: String, functions: String,
    lugWidth: String, thickness: String,
  },
  warrantyYears: { type: Number, default: 2 },
  stock: Number, sku: String,
  isFeatured: Boolean, isNewArrival: Boolean,
  isBestSeller: Boolean, isLimitedEdition: Boolean,
  status: { type: String, default: "active" },
  sortOrder: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
}, { timestamps: true });

const Category  = mongoose.models.Category  ?? mongoose.model("Category",  CategorySchema);
const Collection= mongoose.models.Collection?? mongoose.model("Collection",CollectionSchema);
const Product   = mongoose.models.Product   ?? mongoose.model("Product",   ProductSchema);

// ─── Seed data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Men's Watches",    slug: "mens-watches",    sortOrder: 1 },
  { name: "Women's Watches",  slug: "womens-watches",  sortOrder: 2 },
  { name: "Unisex",           slug: "unisex",          sortOrder: 3 },
  { name: "Classic",          slug: "classic",         sortOrder: 4 },
  { name: "Sport",            slug: "sport",           sortOrder: 5 },
  { name: "Luxury",           slug: "luxury",          sortOrder: 6 },
  { name: "Limited Edition",  slug: "limited-edition", sortOrder: 7 },
  { name: "New Arrivals",     slug: "new-arrivals",    sortOrder: 8 },
  { name: "Best Sellers",     slug: "best-sellers",    sortOrder: 9 },
  { name: "Signature Collection", slug: "signature-collection", sortOrder: 10 },
];

const COLLECTIONS = [
  {
    name: "Eternal Reign", slug: "eternal-reign",
    tagline: "A dynasty of precision — forged for those who command the room.",
    description: "The Eternal Reign collection draws from centuries of West African royal heritage, reimagined through ultra-precise Swiss-inspired movements. Each piece is a testament to enduring power.",
    coverImage: "/images/collections/eternal-reign-cover.jpg",
    isActive: true, isFeatured: true, sortOrder: 1,
  },
  {
    name: "Midnight Sovereign", slug: "midnight-sovereign",
    tagline: "When darkness falls, the sovereign shines.",
    description: "Deep-dialled masterpieces crafted for the night. The Midnight Sovereign collection captures the opulence of evening wear with DLCS-coated cases and guilloché-textured dials.",
    coverImage: "/images/collections/midnight-sovereign-cover.jpg",
    isActive: true, isFeatured: true, sortOrder: 2,
  },
  {
    name: "Lagos Gold Rush", slug: "lagos-gold-rush",
    tagline: "Born from Lagos. Built for the world.",
    description: "A celebration of Lagos energy — bold, unapologetic, and entirely original. Yellow gold-tone cases with vibrant sunburst dials that move with you.",
    coverImage: "/images/collections/lagos-gold-rush-cover.jpg",
    isActive: true, isFeatured: false, sortOrder: 3,
  },
];

async function seedCategories() {
  const results: Record<string, mongoose.Types.ObjectId> = {};
  for (const cat of CATEGORIES) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (existing) {
      results[cat.slug] = existing._id;
      console.log(`  Category exists: ${cat.name}`);
    } else {
      const created = await Category.create(cat);
      results[cat.slug] = created._id;
      console.log(`  Category created: ${cat.name}`);
    }
  }
  return results;
}

async function seedCollections() {
  const results: Record<string, mongoose.Types.ObjectId> = {};
  for (const col of COLLECTIONS) {
    const existing = await Collection.findOne({ slug: col.slug });
    if (existing) {
      results[col.slug] = existing._id;
      console.log(`  Collection exists: ${col.name}`);
    } else {
      const created = await Collection.create(col);
      results[col.slug] = created._id;
      console.log(`  Collection created: ${col.name}`);
    }
  }
  return results;
}

async function seedProducts(
  categories: Record<string, mongoose.Types.ObjectId>,
  collections: Record<string, mongoose.Types.ObjectId>
) {
  const PRODUCTS = [
    {
      name: "QG Eternal Reign I",
      slug: "qg-eternal-reign-i",
      shortDescription: "The flagship piece of the Eternal Reign collection — a bold statement of precision and heritage in stainless steel and gold.",
      description: `The Queen Gold Eternal Reign I is where ancestral power meets horological mastery. Its 42mm stainless steel case with gold PVD coating houses the signature CROWNCALIBRE™ CC-01 automatic movement, visible through the exhibition caseback.\n\nThe sunburst champagne dial features applied gold indices and a date aperture at 3 o'clock. Water resistant to 100 metres, this is a watch built for every occasion where presence matters.`,
      price: 485000,
      comparePrice: 0,
      thumbnailImage: "/images/products/qg-er-01-front.jpg",
      images: ["/images/products/qg-er-01-front.jpg", "/images/products/qg-er-01-side.jpg"],
      category: categories["mens-watches"],
      collections: [collections["eternal-reign"]],
      tags: ["automatic", "gold", "flagship", "stainless-steel"],
      gender: "men",
      specifications: {
        movement: "CROWNCALIBRE™ CC-01 Automatic",
        caseMaterial: "316L Stainless Steel, Gold PVD",
        caseSize: "42mm",
        dialColor: "Champagne Sunburst",
        bracelet: "Stainless Steel Oyster-style",
        waterResistance: "100 metres / 330 feet",
        crystalType: "Double-domed Sapphire, AR-coated",
        powerReserve: "42 hours",
        functions: "Hours, Minutes, Seconds, Date",
        lugWidth: "20mm",
        thickness: "11.5mm",
      },
      warrantyYears: 2,
      stock: 14,
      sku: "QG-ER-01",
      isFeatured: true, isNewArrival: false, isBestSeller: true, isLimitedEdition: false,
      status: "active", sortOrder: 1,
    },
    {
      name: "QG Midnight Sovereign I",
      slug: "qg-midnight-sovereign-i",
      shortDescription: "All-black DLCS case with a mesmerising galactic dial — the Midnight Sovereign is pure nocturnal authority.",
      description: `Announcing its presence in absolute darkness, the Midnight Sovereign I is coated in Diamond-Like Carbon Steel (DLCS), rendering it virtually scratch-proof. The deep-blue meteorite-inspired dial catches and scatters light with every movement of the wrist.\n\nPowered by the CROWNCALIBRE™ CC-02 movement with 72-hour power reserve, this piece is as technically formidable as it is visually arresting.`,
      price: 695000,
      comparePrice: 750000,
      thumbnailImage: "/images/products/qg-ms-01-front.jpg",
      images: ["/images/products/qg-ms-01-front.jpg"],
      category: categories["luxury"],
      collections: [collections["midnight-sovereign"]],
      tags: ["automatic", "black", "dlcs", "sapphire", "limited"],
      gender: "men",
      specifications: {
        movement: "CROWNCALIBRE™ CC-02 Automatic",
        caseMaterial: "316L Stainless Steel, DLCS Coating",
        caseSize: "44mm",
        dialColor: "Galactic Blue / Meteorite-inspired",
        bracelet: "Black PVD Steel Bracelet",
        waterResistance: "200 metres / 660 feet",
        crystalType: "Sapphire Crystal, Anti-reflective",
        powerReserve: "72 hours",
        functions: "Hours, Minutes, Seconds",
        lugWidth: "22mm",
        thickness: "12mm",
      },
      warrantyYears: 2,
      stock: 7,
      sku: "QG-MS-01",
      isFeatured: true, isNewArrival: true, isBestSeller: false, isLimitedEdition: false,
      status: "active", sortOrder: 2,
    },
    {
      name: "QG Lagos Gold Rush Chrono",
      slug: "qg-lagos-gold-rush-chrono",
      shortDescription: "Lagos born, globally acclaimed — a bold chronograph in yellow gold-tone with a striking sunburst orange dial.",
      description: `The Lagos Gold Rush Chrono is a burst of Lagos-born energy on your wrist. Inspired by the relentless vitality of Nigeria's commercial capital, its yellow gold-tone 43mm case frames a vibrant orange sunburst dial with three white subsidiary dials.\n\nThe CROWNCALIBRE™ CC-03 chronograph movement delivers 1/4 second timing accuracy. A tachymetre scale on the outer bezel completes the performance aesthetic.`,
      price: 395000,
      comparePrice: 0,
      thumbnailImage: "/images/products/qg-lgr-01-front.jpg",
      images: ["/images/products/qg-lgr-01-front.jpg"],
      category: categories["mens-watches"],
      collections: [collections["lagos-gold-rush"]],
      tags: ["chronograph", "gold", "sport", "lagos"],
      gender: "men",
      specifications: {
        movement: "CROWNCALIBRE™ CC-03 Chronograph Quartz",
        caseMaterial: "Stainless Steel, Yellow Gold PVD",
        caseSize: "43mm",
        dialColor: "Sunburst Orange",
        bracelet: "Yellow Gold-tone Steel Bracelet",
        waterResistance: "50 metres / 165 feet",
        crystalType: "Hardened Mineral Crystal",
        powerReserve: "Battery (approx. 3 years)",
        functions: "Hours, Minutes, Seconds, Chronograph, Date",
        lugWidth: "22mm",
        thickness: "10.8mm",
      },
      warrantyYears: 2,
      stock: 22,
      sku: "QG-LGR-01",
      isFeatured: true, isNewArrival: true, isBestSeller: false, isLimitedEdition: false,
      status: "active", sortOrder: 3,
    },
    {
      name: "QG Sovereign Lady Rose",
      slug: "qg-sovereign-lady-rose",
      shortDescription: "An exquisite 36mm rose gold timepiece for the woman who leads with poise and intention.",
      description: `The Sovereign Lady Rose is the definitive Queen Gold women's piece. Its 36mm rose gold PVD case sits elegantly on the wrist, adorned with a mother-of-pearl dial featuring 12 diamond-cut indices.\n\nThe CROWNCALIBRE™ CC-L01 quartz movement ensures impeccable accuracy in a slender profile that transitions effortlessly from boardroom to gala.`,
      price: 320000,
      comparePrice: 0,
      thumbnailImage: "/images/products/qg-slr-01-front.jpg",
      images: ["/images/products/qg-slr-01-front.jpg"],
      category: categories["womens-watches"],
      collections: [collections["eternal-reign"]],
      tags: ["rose-gold", "mother-of-pearl", "women", "elegant"],
      gender: "women",
      specifications: {
        movement: "CROWNCALIBRE™ CC-L01 Quartz",
        caseMaterial: "316L Stainless Steel, Rose Gold PVD",
        caseSize: "36mm",
        dialColor: "White Mother-of-Pearl",
        bracelet: "Rose Gold PVD Mesh Bracelet",
        waterResistance: "30 metres / 100 feet",
        crystalType: "Anti-reflective Sapphire Crystal",
        powerReserve: "Battery (approx. 3 years)",
        functions: "Hours, Minutes, Seconds",
        lugWidth: "18mm",
        thickness: "7.5mm",
      },
      warrantyYears: 2,
      stock: 18,
      sku: "QG-SLR-01",
      isFeatured: true, isNewArrival: false, isBestSeller: true, isLimitedEdition: false,
      status: "active", sortOrder: 4,
    },
    {
      name: "QG Eternal Reign GMT",
      slug: "qg-eternal-reign-gmt",
      shortDescription: "Track two time zones simultaneously — the traveller's choice from the flagship Eternal Reign line.",
      description: `The Eternal Reign GMT is the worldly companion piece in the Queen Gold flagship collection. Its three-hand GMT complication allows tracking of two time zones simultaneously — essential for the modern African executive operating across continents.\n\nFeaturing a bidirectional rotating 24-hour bezel and the signature CROWNCALIBRE™ CC-GMT automatic movement with 48-hour power reserve.`,
      price: 575000,
      comparePrice: 0,
      thumbnailImage: "/images/products/qg-er-gmt-front.jpg",
      images: ["/images/products/qg-er-gmt-front.jpg"],
      category: categories["mens-watches"],
      collections: [collections["eternal-reign"]],
      tags: ["gmt", "automatic", "travel", "dual-timezone"],
      gender: "men",
      specifications: {
        movement: "CROWNCALIBRE™ CC-GMT Automatic",
        caseMaterial: "316L Stainless Steel, Gold PVD",
        caseSize: "41mm",
        dialColor: "Slate Blue",
        bracelet: "Stainless Steel & Gold PVD Jubilee-style",
        waterResistance: "100 metres / 330 feet",
        crystalType: "Sapphire Crystal, AR-coated",
        powerReserve: "48 hours",
        functions: "Hours, Minutes, Seconds, GMT (2nd Time Zone), Date",
        lugWidth: "20mm",
        thickness: "12.5mm",
      },
      warrantyYears: 2,
      stock: 9,
      sku: "QG-ER-GMT",
      isFeatured: true, isNewArrival: true, isBestSeller: false, isLimitedEdition: false,
      status: "active", sortOrder: 5,
    },
    {
      name: "QG Crown Limited — 001/100",
      slug: "qg-crown-limited-001",
      shortDescription: "First in a series of 100 — the Queen Gold Crown Limited is hand-finished, numbered, and will never be made again.",
      description: `Only 100 pieces of the Crown Limited will ever exist. Each is individually numbered on the caseback and hand-finished by Queen Gold's atelier. The skeletonised dial reveals the CROWNCALIBRE™ CC-SK movement in all its open-worked glory.\n\nEvery Crown Limited comes with a serialised certificate of authenticity, museum-quality presentation box, and full Digital Watch Passport activation.`,
      price: 1850000,
      comparePrice: 0,
      thumbnailImage: "/images/products/qg-cl-001-front.jpg",
      images: ["/images/products/qg-cl-001-front.jpg"],
      category: categories["limited-edition"],
      collections: [collections["eternal-reign"]],
      tags: ["limited", "skeleton", "numbered", "collector"],
      gender: "unisex",
      specifications: {
        movement: "CROWNCALIBRE™ CC-SK Skeleton Automatic",
        caseMaterial: "18K Rose Gold-plated 316L Steel",
        caseSize: "40mm",
        dialColor: "Open-worked Skeleton",
        bracelet: "Genuine Alligator Leather, Rose Gold Clasp",
        waterResistance: "30 metres / 100 feet",
        crystalType: "Box Sapphire Crystal",
        powerReserve: "68 hours",
        functions: "Hours, Minutes, Tourbillon-inspired Second Wheel",
        lugWidth: "20mm",
        thickness: "13mm",
      },
      warrantyYears: 5,
      stock: 3,
      sku: "QG-CL-001",
      isFeatured: true, isNewArrival: false, isBestSeller: false, isLimitedEdition: true,
      status: "active", sortOrder: 0,
    },
    {
      name: "QG Sport Diver Pro",
      slug: "qg-sport-diver-pro",
      shortDescription: "Professional-grade dive watch with a unidirectional bezel and 300m water resistance — for the adventurous spirit.",
      description: `The Sport Diver Pro brings Queen Gold's design philosophy to the world of technical dive watches. Its 44mm case in brushed stainless steel is rated to 300 metres water resistance with a helium escape valve for saturation diving.\n\nThe luminous indices and hands — filled with Swiss Super-LumiNova® — ensure legibility in the deepest water, while the screw-down crown prevents any ingress.`,
      price: 285000,
      comparePrice: 320000,
      thumbnailImage: "/images/products/qg-sdp-01-front.jpg",
      images: ["/images/products/qg-sdp-01-front.jpg"],
      category: categories["sport"],
      collections: [],
      tags: ["diver", "sport", "automatic", "water-resistant"],
      gender: "unisex",
      specifications: {
        movement: "CROWNCALIBRE™ CC-D01 Automatic",
        caseMaterial: "316L Brushed Stainless Steel",
        caseSize: "44mm",
        dialColor: "Deep Navy Blue",
        bracelet: "Solid Steel Oyster Bracelet",
        waterResistance: "300 metres / 1000 feet",
        crystalType: "Flat Sapphire Crystal",
        powerReserve: "42 hours",
        functions: "Hours, Minutes, Seconds, Unidirectional Bezel",
        lugWidth: "22mm",
        thickness: "13.5mm",
      },
      warrantyYears: 2,
      stock: 31,
      sku: "QG-SDP-01",
      isFeatured: false, isNewArrival: false, isBestSeller: true, isLimitedEdition: false,
      status: "active", sortOrder: 6,
    },
    {
      name: "QG Classic Dress Silver",
      slug: "qg-classic-dress-silver",
      shortDescription: "Understated elegance in silver — a slim dress watch for occasions that demand quiet authority.",
      description: `The Classic Dress Silver is for those who understand that restraint is the highest form of luxury. At just 7.8mm thin, it slips under a shirt cuff with effortless grace.\n\nThe ice-blue sunray dial with stick indices and blued-steel hands references the finest Swiss dress watches, while the hand-stitched alligator strap ensures it feels as premium as it looks.`,
      price: 220000,
      comparePrice: 0,
      thumbnailImage: "/images/products/qg-cds-01-front.jpg",
      images: ["/images/products/qg-cds-01-front.jpg"],
      category: categories["classic"],
      collections: [],
      tags: ["dress", "slim", "classic", "quartz"],
      gender: "men",
      specifications: {
        movement: "CROWNCALIBRE™ CC-Q01 Swiss Quartz",
        caseMaterial: "Stainless Steel, Polished",
        caseSize: "38mm",
        dialColor: "Ice Blue Sunray",
        bracelet: "Alligator-grain Leather Strap",
        waterResistance: "30 metres / 100 feet",
        crystalType: "Flat Sapphire Crystal",
        powerReserve: "Battery (approx. 3 years)",
        functions: "Hours, Minutes",
        lugWidth: "19mm",
        thickness: "7.8mm",
      },
      warrantyYears: 2,
      stock: 26,
      sku: "QG-CDS-01",
      isFeatured: false, isNewArrival: false, isBestSeller: false, isLimitedEdition: false,
      status: "active", sortOrder: 7,
    },
  ];

  let created = 0, skipped = 0;
  for (const p of PRODUCTS) {
    const existing = await Product.findOne({ slug: p.slug });
    if (existing) {
      skipped++;
      console.log(`  Product exists: ${p.name}`);
    } else {
      await Product.create(p);
      created++;
      console.log(`  Product created: ${p.name}`);
    }
  }
  console.log(`\nProducts: ${created} created, ${skipped} skipped.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("Connected.\n");

  console.log("Seeding categories…");
  const cats = await seedCategories();

  console.log("\nSeeding collections…");
  const cols = await seedCollections();

  console.log("\nSeeding products…");
  await seedProducts(cats, cols);

  console.log("\nEcommerce seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
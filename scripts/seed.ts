/**
 * Seed script — run once to bootstrap the database.
 *
 * Usage:
 *   cp .env.example .env.local          # fill in MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD
 *   npx tsx scripts/seed.ts
 */

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

/* ─── Inline schema definitions (avoid Next.js module resolution) ─────────── */

const WatchSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    model: { type: String, default: "QG-ER-01" },
    collection: { type: String, default: "Eternal Reign" },
    movement: { type: String, default: "CROWNCALIBRE™ CC-01" },
    status: {
      type: String,
      enum: ["unregistered", "registered", "sold"],
      default: "unregistered",
    },
    warrantyStatus: {
      type: String,
      enum: ["active", "expired", "void"],
      default: "active",
    },
    dateOfPurchase: { type: Date, default: null },
    dealer: { type: String, default: "Queen Gold Lagos" },
    scanCount: { type: Number, default: 0 },
    firstScannedAt: { type: Date, default: null },
    lastScannedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true },
);

const Watch = mongoose.models.Watch ?? mongoose.model("Watch", WatchSchema);

const Admin = mongoose.models.Admin ?? mongoose.model("Admin", AdminSchema);

/* ─── Sample watches ──────────────────────────────────────────────────────── */
const SAMPLE_WATCHES = [
  {
    serialNumber: "Q04R7254",
    model: "QG-ER-01",
    collection: "Eternal Reign",
    movement: "CROWNCALIBRE™ CC-01",
    status: "sold",
    warrantyStatus: "active",
    dateOfPurchase: new Date("2024-11-12"),
    dealer: "Queen Gold Lagos",
  },
  {
    serialNumber: "Q04R7255",
    model: "QG-ER-01",
    collection: "Eternal Reign",
    movement: "CROWNCALIBRE™ CC-01",
    status: "registered",
    warrantyStatus: "active",
    dateOfPurchase: new Date("2024-12-06"),
    dealer: "Queen Gold Lagos",
  },
  {
    serialNumber: "Q04R7300",
    model: "QG-ER-02",
    collection: "Eternal Reign",
    movement: "CROWNCALIBRE™ CC-01",
    status: "unregistered",
    warrantyStatus: "active",
    dateOfPurchase: null,
    dealer: "Queen Gold Lagos",
  },
];

/* ─── Main ────────────────────────────────────────────────────────────────── */
async function seed() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("Connected.");

  /* Ensure indexes */
  await Watch.createIndexes();
  await Admin.createIndexes();
  console.log("Indexes ensured.");

  /* Admin user */
  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`Admin '${ADMIN_EMAIL}' already exists — skipping.`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash: hash,
      name: "Queen Gold Admin",
      role: "superadmin",
    });
    console.log(`Admin created: ${ADMIN_EMAIL}`);
  }

  /* Sample watches */
  let created = 0;
  let skipped = 0;
  for (const w of SAMPLE_WATCHES) {
    try {
      await Watch.create(w);
      created++;
      console.log(`  Watch created: ${w.serialNumber}`);
    } catch (err: unknown) {
      if ((err as { code?: number }).code === 11000) {
        skipped++;
        console.log(`  Watch skipped (duplicate): ${w.serialNumber}`);
      } else {
        throw err;
      }
    }
  }

  console.log(
    `\nSeed complete. Watches: ${created} created, ${skipped} skipped.`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

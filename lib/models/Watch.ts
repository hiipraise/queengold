import mongoose, { Schema, Model } from "mongoose";

export type WatchStatus = "unregistered" | "registered" | "sold";
export type WarrantyStatus = "active" | "expired" | "void";

export interface IWatch {
  serialNumber: string;         // Normalized UPPERCASE, unique
  model: string;                // e.g. "QG-ER-01"
  collection: string;           // e.g. "Eternal Reign"
  movement: string;             // e.g. "CROWNCALIBRE™ CC-01"
  status: WatchStatus;
  warrantyStatus: WarrantyStatus;
  dateOfPurchase: Date | null;
  dealer: string;
  scanCount: number;
  firstScannedAt: Date | null;
  lastScannedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const WatchSchema = new Schema<IWatch>(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      default: "QG-ER-01",
    },
    collection: {
      type: String,
      required: true,
      trim: true,
      default: "Eternal Reign",
    },
    movement: {
      type: String,
      required: true,
      trim: true,
      default: "CROWNCALIBRE™ CC-01",
    },
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
    dateOfPurchase: {
      type: Date,
      default: null,
    },
    dealer: {
      type: String,
      trim: true,
      default: "Queen Gold Lagos",
    },
    scanCount: {
      type: Number,
      default: 0,
    },
    firstScannedAt: {
      type: Date,
      default: null,
    },
    lastScannedAt: {
      type: Date,
      default: null,
    },
  },
  {
    suppressReservedKeysWarning: true,
    timestamps: true,
    // Never expose _id or __v to API consumers; use a virtual `id` instead
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: { _id?: unknown; __v?: unknown }) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Normalize serial before save — strip whitespace, force uppercase
WatchSchema.pre("save", function (next) {
  this.serialNumber = this.serialNumber.toUpperCase().trim().replace(/\s+/g, "");
  next();
});

// Also normalize on findOneAndUpdate / updateOne
WatchSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update?.serialNumber) {
    update.serialNumber = String(update.serialNumber)
      .toUpperCase()
      .trim()
      .replace(/\s+/g, "");
  }
  next();
});

export const Watch: Model<IWatch> =
  mongoose.models.Watch ?? mongoose.model<IWatch>("Watch", WatchSchema);

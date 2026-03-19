import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScanLog extends Document {
  serialAttempted: string;
  ip: string;
  userAgent: string;
  found: boolean;
  timestamp: Date;
}

const ScanLogSchema = new Schema<IScanLog>(
  {
    serialAttempted: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
    found: {
      type: Boolean,
      required: true,
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
      // index: true,
    },
  },
  {
    // Logs are append-only; keep 90 days by default using a TTL index
    timeseries: undefined,
  }
);

// TTL: auto-expire logs after 90 days
ScanLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7_776_000 });

// Index for admin log search
ScanLogSchema.index({ serialAttempted: 1, timestamp: -1 });
ScanLogSchema.index({ ip: 1, timestamp: -1 });

export const ScanLog: Model<IScanLog> =
  mongoose.models.ScanLog ??
  mongoose.model<IScanLog>("ScanLog", ScanLogSchema);

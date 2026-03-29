import mongoose, { Model, Schema, Types } from "mongoose";

export interface IPayment {
  orderId: Types.ObjectId;
  provider: "squad";
  status: "initiated" | "success" | "failed";
  amount: number;
  currency: string;
  transactionRef: string;
  providerReference?: string;
  rawPayload?: Record<string, unknown>;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    provider: { type: String, enum: ["squad"], default: "squad" },
    status: { type: String, enum: ["initiated", "success", "failed"], default: "initiated" },
    amount: Number,
    currency: { type: String, default: "NGN" },
    transactionRef: { type: String, required: true, unique: true },
    providerReference: String,
    rawPayload: { type: Map, of: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Payment: Model<IPayment> = mongoose.models.Payment ?? mongoose.model<IPayment>("Payment", PaymentSchema);

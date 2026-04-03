import mongoose, { Schema, Model } from "mongoose";

export type PaymentGatewayStatus = "initiated" | "success" | "failed" | "abandoned";

export interface IPayment {
  _id?: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  customer?: mongoose.Types.ObjectId;
  guestEmail?: string;
  squadTransactionRef: string;
  squadCheckoutUrl?: string;
  amount: number; // in kobo
  currency: string;
  gatewayStatus: PaymentGatewayStatus;
  gatewayResponse?: Record<string, unknown>;
  webhookPayload?: Record<string, unknown>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order:              { type: Schema.Types.ObjectId, ref: "Order", required: true },
    customer:           { type: Schema.Types.ObjectId, ref: "Customer" },
    guestEmail:         { type: String, lowercase: true, trim: true },
    squadTransactionRef:{ type: String, required: true, unique: true },
    squadCheckoutUrl:   { type: String },
    amount:             { type: Number, required: true },
    currency:           { type: String, default: "NGN" },
    gatewayStatus:      { type: String, enum: ["initiated","success","failed","abandoned"], default: "initiated" },
    gatewayResponse:    { type: Schema.Types.Mixed },
    webhookPayload:     { type: Schema.Types.Mixed },
    paidAt:             { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

PaymentSchema.index({ squadTransactionRef: 1 });
PaymentSchema.index({ order: 1 });
PaymentSchema.index({ gatewayStatus: 1 });

export const Payment: Model<IPayment> =
  mongoose.models.Payment ?? mongoose.model<IPayment>("Payment", PaymentSchema);
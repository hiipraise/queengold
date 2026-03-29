import mongoose, { Model, Schema, Types } from "mongoose";

export interface IOrder {
  orderNumber: string;
  customerId?: Types.ObjectId;
  email: string;
  status: "pending" | "paid" | "failed" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: Types.ObjectId;
    name: string;
    unitPrice: number;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  shippingAddress: Record<string, string>;
  trackingNumber?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, index: true, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        unitPrice: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: Number,
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    shippingAddress: { type: Map, of: String, default: {} },
    trackingNumber: String,
  },
  { timestamps: true },
);

export const Order: Model<IOrder> = mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);

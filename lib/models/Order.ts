import mongoose, { Schema, Model } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  thumbnailImage: string;
}

export interface IOrderAddress {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  orderNumber: string;
  customer?: mongoose.Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: IOrderAddress;
  billingAddress?: IOrderAddress;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReference?: string;
  squadTransactionRef?: string;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product:        { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name:           { type: String, required: true },
    sku:            { type: String, required: true },
    price:          { type: Number, required: true },
    quantity:       { type: Number, required: true, min: 1 },
    thumbnailImage: { type: String, required: true },
  },
  { _id: false }
);

const AddressSchema = new Schema<IOrderAddress>(
  {
    firstName:    { type: String, required: true },
    lastName:     { type: String, required: true },
    phone:        { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city:         { type: String, required: true },
    state:        { type: String, required: true },
    country:      { type: String, required: true },
    postalCode:   { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber:       { type: String, required: true, unique: true },
    customer:          { type: Schema.Types.ObjectId, ref: "Customer" },
    guestEmail:        { type: String, lowercase: true, trim: true },
    items:             { type: [OrderItemSchema], required: true },
    shippingAddress:   { type: AddressSchema, required: true },
    billingAddress:    { type: AddressSchema },
    subtotal:          { type: Number, required: true },
    shippingCost:      { type: Number, default: 0 },
    taxAmount:         { type: Number, default: 0 },
    discountAmount:    { type: Number, default: 0 },
    couponCode:        { type: String },
    total:             { type: Number, required: true },
    currency:          { type: String, default: "NGN" },
    orderStatus:       { type: String, enum: ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"], default: "pending" },
    paymentStatus:     { type: String, enum: ["pending","paid","failed","refunded"], default: "pending" },
    paymentMethod:     { type: String, default: "squad" },
    paymentReference:  { type: String },
    squadTransactionRef: { type: String },
    notes:             { type: String },
    trackingNumber:    { type: String },
    shippedAt:         { type: Date },
    deliveredAt:       { type: Date },
    cancelledAt:       { type: Date },
    cancelReason:      { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, paymentStatus: 1 });
OrderSchema.index({ squadTransactionRef: 1 });

// Generate order number: QG-YYYYMMDD-XXXXX
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `QG-${dateStr}-${rand}`;
  }
  next();
});

export const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);
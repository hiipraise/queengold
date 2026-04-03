import mongoose, { Schema, Model } from "mongoose";

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // price at time of adding to cart
  name: string;
  thumbnailImage: string;
  sku: string;
}

export interface ICart {
  _id?: mongoose.Types.ObjectId;
  sessionId?: string; // for guest carts
  customer?: mongoose.Types.ObjectId; // for logged-in carts
  items: ICartItem[];
  couponCode?: string;
  couponDiscount?: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product:        { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity:       { type: Number, required: true, min: 1, default: 1 },
    price:          { type: Number, required: true },
    name:           { type: String, required: true },
    thumbnailImage: { type: String, required: true },
    sku:            { type: String, required: true },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    sessionId:      { type: String, index: true },
    customer:       { type: Schema.Types.ObjectId, ref: "Customer", index: true },
    items:          { type: [CartItemSchema], default: [] },
    couponCode:     { type: String },
    couponDiscount: { type: Number, default: 0 },
    expiresAt:      { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

// TTL index — expire abandoned carts
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

CartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

CartSchema.virtual("total").get(function () {
  const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.max(0, subtotal - (this.couponDiscount ?? 0));
});

CartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

export const Cart: Model<ICart> =
  mongoose.models.Cart ?? mongoose.model<ICart>("Cart", CartSchema);
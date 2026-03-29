import mongoose, { Model, Schema, Types } from "mongoose";

interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  customerId?: Types.ObjectId;
  sessionId: string;
  items: ICartItem[];
  couponCode?: string;
}

const CartSchema = new Schema<ICart>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    sessionId: { type: String, required: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, min: 1, required: true },
      },
    ],
    couponCode: String,
  },
  { timestamps: true },
);

export const Cart: Model<ICart> = mongoose.models.Cart ?? mongoose.model<ICart>("Cart", CartSchema);

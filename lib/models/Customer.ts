import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface ICustomer {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  comparePassword(password: string): Promise<boolean>;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
  },
  { timestamps: true },
);

CustomerSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export const Customer: Model<ICustomer> = mongoose.models.Customer ?? mongoose.model<ICustomer>("Customer", CustomerSchema);

import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Wishlist } from "@/lib/models/Wishlist";
import { Cart } from "@/lib/models/Cart";

export interface CartItemInput { slug: string; quantity: number }

export async function getProductsForSlugs(slugs: string[]) {
  await connectDB();
  const products = await Product.find({ slug: { $in: slugs } }).lean();
  return new Map(products.map((product) => [product.slug, product]));
}

export async function getWishlist(email: string) {
  await connectDB();
  const wishlist = await Wishlist.findOne({ customerEmail: email }).lean() as any;
  return wishlist?.productSlugs ?? [];
}

export async function saveWishlist(email: string, productSlugs: string[]) {
  await connectDB();
  const uniqueSlugs = Array.from(new Set(productSlugs));
  await Wishlist.findOneAndUpdate(
    { customerEmail: email },
    { customerEmail: email, productSlugs: uniqueSlugs },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return uniqueSlugs;
}

export async function getCart(email: string) {
  await connectDB();
  const cart = await Cart.findOne({ customerEmail: email }).lean() as any;
  return cart?.items ?? [];
}

export async function saveCart(email: string, items: CartItemInput[]) {
  await connectDB();
  const normalized = items.filter((item) => item.quantity > 0);
  await Cart.findOneAndUpdate(
    { customerEmail: email },
    { customerEmail: email, items: normalized },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return normalized;
}

import { Product } from "@/lib/models/Product";

export async function checkStockLevels(items: Array<{ productId: string; quantity: number }>) {
  const ids = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids } }).select("_id stock name").lean();
  const byId = new Map(products.map((product) => [String(product._id), product]));

  return items.map((item) => {
    const product = byId.get(item.productId);
    const valid = (product?.stock ?? 0) >= item.quantity;
    return {
      ...item,
      valid,
      availableStock: product?.stock ?? 0,
      name: product?.name ?? "Unavailable item",
    };
  });
}

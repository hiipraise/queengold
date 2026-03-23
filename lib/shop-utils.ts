import { products } from "@/lib/site-data";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function discountedPrice(price: number, discountPercentage?: number) {
  return price * (1 - (discountPercentage ?? 0) / 100);
}

export function relatedProducts(slug: string) {
  const product = products.find((item) => item.slug === slug);
  if (!product) return [];
  return products.filter((item) => item.slug !== slug && (item.collection === product.collection || item.category === product.category)).slice(0, 3);
}

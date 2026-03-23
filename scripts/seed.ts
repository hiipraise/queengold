import "dotenv/config";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { Collection } from "@/lib/models/Collection";
import { products, categories, collections } from "@/lib/site-data";

async function main() {
  await connectDB();
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Collection.deleteMany({}),
  ]);
  await Promise.all([
    Product.insertMany(products),
    Category.insertMany(categories),
    Collection.insertMany(collections),
  ]);
  console.log(`Seeded ${products.length} products, ${categories.length} categories, and ${collections.length} collections.`);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});

import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { Payment } from "@/lib/models/Payment";

export default async function CommerceAdminPage() {
  await connectDB();
  const [productCount, orderCount, payments, latestOrders, latestProducts] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Payment.find({ status: "success" }).lean(),
    Order.find({}).sort({ createdAt: -1 }).limit(10).lean(),
    Product.find({}).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const revenue = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl">Commerce Dashboard</h1>
        <Link href="/admin/watches" className="border border-[var(--border-gold)] px-3 py-2 text-xs">Watch Verification Admin</Link>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <article className="card-luxury p-5"><p className="text-xs tracking-widest uppercase opacity-60">Revenue</p><p className="font-serif text-3xl mt-1">₦{revenue.toLocaleString()}</p></article>
        <article className="card-luxury p-5"><p className="text-xs tracking-widest uppercase opacity-60">Orders</p><p className="font-serif text-3xl mt-1">{orderCount}</p></article>
        <article className="card-luxury p-5"><p className="text-xs tracking-widest uppercase opacity-60">Products</p><p className="font-serif text-3xl mt-1">{productCount}</p></article>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="card-luxury p-5 overflow-auto">
          <h2 className="font-serif text-2xl mb-3">Product Management</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left opacity-60"><th>Name</th><th>Stock</th><th>Flags</th></tr></thead>
            <tbody>{latestProducts.map((product) => <tr key={String(product._id)} className="border-t border-[var(--border-gold)]"><td className="py-3">{product.name}</td><td>{product.stock}</td><td className="text-xs">F:{product.featuredFlags?.featured ? "Y" : "N"} N:{product.featuredFlags?.newArrival ? "Y" : "N"} B:{product.featuredFlags?.bestSeller ? "Y" : "N"} L:{product.featuredFlags?.limited ? "Y" : "N"}</td></tr>)}</tbody>
          </table>
        </div>

        <div className="card-luxury p-5 overflow-auto">
          <h2 className="font-serif text-2xl mb-3">Order Management</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left opacity-60"><th>Order</th><th>Status</th><th>Total</th><th>Tracking</th></tr></thead>
            <tbody>{latestOrders.map((order) => <tr key={String(order._id)} className="border-t border-[var(--border-gold)]"><td className="py-3">{order.orderNumber}</td><td>{order.status}</td><td>₦{order.total.toLocaleString()}</td><td>{order.trackingNumber || "—"}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

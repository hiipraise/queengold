import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { Customer } from "@/lib/models/Customer";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboard() {
  await connectDB();

  const [
    totalOrders,
    totalRevenue,
    pendingOrders,
    totalProducts,
    outOfStock,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments({ paymentStatus: "paid" }),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).then((r) => r[0]?.total ?? 0),
    Order.countDocuments({ orderStatus: "pending" }),
    Product.countDocuments({ status: "active" }),
    Product.countDocuments({ status: "active", stock: 0 }),
    Customer.countDocuments({ isActive: true }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "orderNumber total orderStatus paymentStatus createdAt guestEmail",
      )
      .populate<{
        customer: { firstName: string; lastName: string };
      }>("customer", "firstName lastName")
      .lean(),
  ]);

  const kpis = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      sub: "Paid orders",
      href: "/admin/orders?payment=paid",
    },
    {
      label: "Total Orders",
      value: String(totalOrders),
      sub: "Completed",
      href: "/admin/orders",
    },
    {
      label: "Pending",
      value: String(pendingOrders),
      sub: "Needs action",
      href: "/admin/orders?status=pending",
    },
    {
      label: "Active Products",
      value: String(totalProducts),
      sub: `${outOfStock} out of stock`,
      href: "/admin/products",
    },
    {
      label: "Customers",
      value: String(totalCustomers),
      sub: "Registered",
      href: "/admin/customers",
    },
  ];

  const statusColor = (s: string) =>
    ({
      pending: { c: "#C9A84C" },
      confirmed: { c: "#22783C" },
      shipped: { c: "#2980B9" },
      delivered: { c: "#22783C" },
      cancelled: { c: "#C0392B" },
      paid: { c: "#22783C" },
      failed: { c: "#C0392B" },
    })[s] ?? { c: "var(--text-muted)" };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-gold-gradient">Dashboard</h1>
        <p
          className="font-body text-xs mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          Welcome back — here&apos;s your store at a glance.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="card-luxury p-5 transition-all duration-200 hover:border-opacity-50 group"
          >
            <p
              className="font-display text-[9px] tracking-[0.25em] uppercase mb-2"
              style={{ color: "var(--gold-muted)" }}
            >
              {kpi.label}
            </p>
            <p className="font-serif text-2xl text-gold-gradient mb-1">
              {kpi.value}
            </p>
            <p
              className="font-body text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {kpi.sub}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2
          className="font-display text-xs tracking-[0.25em] uppercase mb-4"
          style={{ color: "var(--gold-muted)" }}
        >
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Product", href: "/admin/products/new" },
            { label: "Add Collection", href: "/admin/collections/new" },
            { label: "Add Category", href: "/admin/categories/new" },
            { label: "Register Watch", href: "/admin/watches" },
            { label: "View Orders", href: "/admin/orders" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="font-display text-xs tracking-[0.2em] uppercase px-5 h-10 rounded-sm flex items-center transition-all hover:bg-white/5"
              style={{
                border: "1px solid var(--border-gold)",
                color: "var(--gold-muted)",
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="card-luxury overflow-hidden">
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border-gold)" }}
        >
          <h2 className="font-serif text-lg text-gold-gradient">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="font-display text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "var(--gold-muted)" }}
          >
            View All
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
              {["Order", "Customer", "Total", "Status", "Payment"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left font-display text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--gold-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr
                key={String(o._id)}
                style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}
                className="hover:bg-white/5 transition-colors"
              >
                <td
                  className="px-5 py-3 font-body text-xs tracking-widest"
                  style={{ color: "var(--gold-light)" }}
                >
                  {o.orderNumber}
                </td>
                <td
                  className="px-5 py-3 font-body text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {o.customer
                    ? `${o.customer.firstName} ${o.customer.lastName}`
                    : (o.guestEmail ?? "Guest")}
                </td>
                <td
                  className="px-5 py-3 font-body text-sm"
                  style={{ color: "var(--gold)" }}
                >
                  {formatPrice(o.total)}
                </td>
                <td
                  className="px-5 py-3 font-body text-xs"
                  style={{ color: statusColor(o.orderStatus).c }}
                >
                  {o.orderStatus}
                </td>
                <td
                  className="px-5 py-3 font-body text-xs"
                  style={{ color: statusColor(o.paymentStatus).c }}
                >
                  {o.paymentStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

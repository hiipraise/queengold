import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Customer } from "@/lib/models/Customer";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/account/login?callbackUrl=/account");

  const userId = (session.user as { id?: string }).id;
  const userType = (session.user as { type?: string }).type;

  // Redirect admin to admin panel
  if (userType === "admin") redirect("/admin/watches");

  await connectDB();

  const [customer, recentOrders] = await Promise.all([
    Customer.findById(userId).select("-passwordHash").lean(),
    Order.find({ customer: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber total orderStatus paymentStatus createdAt items")
      .lean(),
  ]);

  const statusColor = (s: string) => ({
    pending:    { color: "#C0392B", bg: "rgba(192,57,43,0.1)" },
    confirmed:  { color: "#22783C", bg: "rgba(34,120,60,0.1)" },
    processing: { color: "var(--gold)", bg: "rgba(212,175,55,0.1)" },
    shipped:    { color: "#2980B9", bg: "rgba(41,128,185,0.1)" },
    delivered:  { color: "#22783C", bg: "rgba(34,120,60,0.1)" },
    cancelled:  { color: "#C0392B", bg: "rgba(192,57,43,0.1)" },
    refunded:   { color: "#7F8C8D", bg: "rgba(127,140,141,0.1)" },
  }[s] ?? { color: "var(--text-muted)", bg: "rgba(0,0,0,0.1)" });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="pt-4 pb-10">
          <p className="font-display text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gold-muted)" }}>
            Welcome Back
          </p>
          <h1 className="font-serif text-4xl text-gold-gradient">
            {customer?.firstName ?? session.user.name}
          </h1>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: "My Orders", href: "/account/orders", icon: "○" },
            { label: "Wishlist", href: "/account/wishlist", icon: "◇" },
            { label: "Addresses", href: "/account/addresses", icon: "△" },
            { label: "Settings", href: "/account/settings", icon: "✦" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-luxury p-5 text-center transition-all duration-200 hover:border-gold group"
              style={{ borderColor: "var(--border-gold)" }}
            >
              <p className="font-serif text-xl mb-2 transition-colors group-hover:text-gold-gradient"
                 style={{ color: "var(--gold-muted)" }}>
                {item.icon}
              </p>
              <p className="font-display text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card-luxury overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-gold)" }}>
            <h2 className="font-serif text-lg text-gold-gradient">Recent Orders</h2>
            <Link href="/account/orders" className="font-display text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--gold-muted)" }}>
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-display text-sm tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
                No orders yet
              </p>
              <p className="font-body text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Discover our collection of luxury timepieces.
              </p>
              <Link href="/shop" className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
              {recentOrders.map((order) => {
                const sc = statusColor(order.orderStatus);
                return (
                  <div key={String(order._id)} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {order.orderNumber}
                      </p>
                      <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span
                      className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm hidden sm:block"
                      style={{ color: sc.color, background: sc.bg }}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="font-body text-sm font-medium flex-shrink-0" style={{ color: "var(--gold)" }}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account summary */}
        {customer && (
          <div className="card-luxury p-6 mt-6">
            <h3 className="font-serif text-lg text-gold-gradient mb-4">Account Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name", value: `${customer.firstName} ${customer.lastName}` },
                { label: "Email", value: customer.email },
                { label: "Phone", value: customer.phone ?? "—" },
                { label: "Total Orders", value: String(customer.totalOrders) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-display text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--gold-muted)" }}>{label}</dt>
                  <dd className="font-body text-sm" style={{ color: "var(--text-primary)" }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
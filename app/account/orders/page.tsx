import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/account/login?callbackUrl=/account/orders");

  const userId = (session.user as { id?: string }).id;
  await connectDB();

  const orders = await Order.find({ customer: userId })
    .sort({ createdAt: -1 })
    .lean();

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending:    { label: "Pending",    color: "#C9A84C", bg: "rgba(201,168,76,0.1)"  },
    confirmed:  { label: "Confirmed",  color: "#22783C", bg: "rgba(34,120,60,0.1)"   },
    processing: { label: "Processing", color: "#D4AF37", bg: "rgba(212,175,55,0.1)"  },
    shipped:    { label: "Shipped",    color: "#2980B9", bg: "rgba(41,128,185,0.1)"  },
    delivered:  { label: "Delivered",  color: "#22783C", bg: "rgba(34,120,60,0.1)"   },
    cancelled:  { label: "Cancelled",  color: "#C0392B", bg: "rgba(192,57,43,0.1)"   },
    refunded:   { label: "Refunded",   color: "#7F8C8D", bg: "rgba(127,140,141,0.1)" },
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="pt-4 pb-10">
          <nav className="flex items-center gap-2 font-body text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            <Link href="/account" className="hover:text-white transition-colors">Account</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Orders</span>
          </nav>
          <h1 className="font-serif text-4xl text-gold-gradient">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <p className="font-display text-sm tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
              No orders yet
            </p>
            <p className="font-body text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Discover our collection of luxury timepieces
            </p>
            <Link href="/shop" className="btn-gold px-8 h-11 text-xs rounded-sm inline-flex items-center justify-center">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const sc = statusConfig[order.orderStatus] ?? statusConfig.pending;
              return (
                <div key={String(order._id)} className="card-luxury overflow-hidden">
                  {/* Order header */}
                  <div
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>
                          {order.orderNumber}
                        </p>
                        <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span
                        className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
                        style={{ color: sc.color, background: sc.bg }}
                      >
                        {sc.label}
                      </span>
                      {order.paymentStatus === "paid" && (
                        <span className="font-display text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm"
                              style={{ color: "#22783C", background: "rgba(34,120,60,0.1)" }}>
                          Paid
                        </span>
                      )}
                    </div>
                    <span className="font-serif text-lg text-gold-gradient">{formatPrice(order.total)}</span>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4 space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="relative w-14 h-14 rounded-sm flex-shrink-0 overflow-hidden"
                          style={{ background: "rgba(45,6,20,0.5)", border: "1px solid var(--border-gold)" }}
                        >
                          {item.thumbnailImage && (
                            <Image src={item.thumbnailImage} alt={item.name} fill className="object-cover" sizes="56px" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm truncate" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                          <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                            {item.sku} · Qty {item.quantity}
                          </p>
                        </div>
                        <p className="font-body text-sm flex-shrink-0" style={{ color: "var(--gold)" }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="px-6 py-3" style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}>
                      <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                        Tracking: <span style={{ color: "var(--gold-muted)" }}>{order.trackingNumber}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
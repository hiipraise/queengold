"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/currency";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/orders").then((r) => r.json()).then((data) => setOrders(data.orders ?? [])).finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl mb-6">Order History</h1>
      {loading && <div className="card-luxury p-6">Loading orders...</div>}
      {!loading && orders.length === 0 && <div className="card-luxury p-6">No orders yet.</div>}
      <div className="space-y-3">{orders.map((order: any) => <div key={order._id} className="card-luxury p-5"><div className="flex justify-between"><p>#{order.orderNumber}</p><p>{order.status}</p></div><p className="text-sm opacity-70 mt-2">{order.items.length} item(s)</p><p className="text-lg mt-2">{formatCurrency(order.total)}</p></div>)}</div>
    </main>
  );
}

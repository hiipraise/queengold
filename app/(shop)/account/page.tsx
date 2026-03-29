import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl">My Account</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card-luxury p-5 md:col-span-2"><p className="text-sm opacity-70">Signed in as</p><p className="text-xl mt-1">{session?.user?.email ?? "Guest"}</p><p className="mt-4 text-sm">Access order history, saved items, and digital passport records linked to your purchases.</p></div>
        <Link href="/account/orders" className="card-luxury p-5"><h2 className="font-serif text-2xl">Orders</h2><p className="mt-2 text-sm opacity-75">View and track purchases.</p></Link>
      </div>
    </main>
  );
}

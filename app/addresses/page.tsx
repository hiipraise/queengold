import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/lib/models/Customer";

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/account/login?callbackUrl=/account/addresses");

  const userId = (session.user as { id?: string }).id;
  await connectDB();

  const customer = await Customer.findById(userId).select("addresses firstName lastName").lean();
  const addresses = customer?.addresses ?? [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pt-4 pb-10">
          <nav className="flex items-center gap-2 font-body text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            <Link href="/account" className="hover:text-white transition-colors">Account</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Addresses</span>
          </nav>
          <h1 className="font-serif text-4xl text-gold-gradient">My Addresses</h1>
        </div>

        {addresses.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <p className="font-display text-sm tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold-muted)" }}>
              No saved addresses
            </p>
            <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>
              Addresses will be saved automatically when you complete your first order.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr, i) => (
              <div key={i} className="card-luxury p-5 space-y-2">
                {addr.isDefault && (
                  <span className="font-display text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-sm"
                        style={{ background: "rgba(212,175,55,0.1)", color: "var(--gold-muted)" }}>
                    Default
                  </span>
                )}
                <p className="font-body text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {addr.firstName} {addr.lastName}
                </p>
                <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                  <br />
                  {addr.city}, {addr.state}
                  <br />
                  {addr.country}
                  <br />
                  {addr.phone}
                </p>
                <p className="font-display text-[10px] tracking-[0.15em] uppercase" style={{ color: "var(--gold-muted)" }}>
                  {addr.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
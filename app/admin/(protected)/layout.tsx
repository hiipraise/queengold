import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role    = (session?.user as { role?: string } | undefined)?.role;

  if (!session || (role !== "admin" && role !== "superadmin")) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col z-10 relative">
      <AdminNav userName={session.user?.name ?? "Admin"} />
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
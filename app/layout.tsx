import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import CartDrawer from "@/components/CartDrawer";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: { default: "Queen Gold — Luxury Watch Ecommerce", template: "%s | Queen Gold" },
  description: "Premium luxury wristwatch ecommerce experience with digital passport verification, concierge shopping, and protected admin operations.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2D0614" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <SiteHeader />
          {children}
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}

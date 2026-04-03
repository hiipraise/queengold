import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/contexts/CartContext";
import { WishlistProvider } from "@/lib/contexts/WishlistContext";

export const metadata: Metadata = {
  title: {
    default:  "Queen Gold — Authentic Luxury Timepieces",
    template: "%s | Queen Gold",
  },
  description:
    "Discover Queen Gold's collection of handcrafted luxury wristwatches. Each piece certified authentic with our Digital Watch Passport.",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "Queen Gold",
    locale:   "en_GB",
    type:     "website",
  },
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#2D0614",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Cormorant+SC:wght@300;400;500;600&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <CartDrawer />
            <main className="flex flex-col min-h-screen">
              {children}
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
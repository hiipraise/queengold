# Queen Gold — Luxury Ecommerce Platform

A full-stack luxury wristwatch ecommerce platform built with Next.js 14, MongoDB, NextAuth, Tailwind CSS, and Squad by GTBank payment integration. Includes the original QR-based Digital Watch Passport verification system fully integrated as a trust feature.

---

## Tech Stack

| Layer        | Technology                                  |
|--------------|---------------------------------------------|
| Framework    | Next.js 14 (App Router, RSC)                |
| Database     | MongoDB via Mongoose                        |
| Auth         | NextAuth.js — Admin + Customer credentials  |
| Payments     | Squad by GTBank                             |
| Styling      | Tailwind CSS + CSS custom properties        |
| QR Codes     | `qrcode` npm package                        |
| Fonts        | Playfair Display, Cormorant SC, Jost        |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/queen-gold
NEXTAUTH_SECRET=your-random-secret         # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@queengold.com
ADMIN_PASSWORD=YourSecurePassword!

# Squad by GTBank — https://dashboard.squadco.com/
SQUAD_SECRET_KEY=sandbox_sk_xxxxxxxxxxxx
SQUAD_PUBLIC_KEY=sandbox_pk_xxxxxxxxxxxx
SQUAD_ENV=sandbox
```

### 3. Seed the database
```bash
npm run seed            # Admin user + 3 sample watches
npm run seed:ecommerce  # 10 categories + 3 collections + 8 products
# Or both:
npm run seed:all
```

### 4. Run development server
```bash
npm run dev
```

---

## URL Map

### Public
| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/shop` | Product catalog with filters |
| `/shop?category=mens-watches` | Category filter |
| `/shop?gender=women` | Gender filter |
| `/shop?filter=new\|bestseller\|limited\|sale` | Type filter |
| `/shop?q=search+term` | Search |
| `/products/[slug]` | Product detail page |
| `/collections` | Collections gallery |
| `/collections/[slug]` | Collection detail |
| `/cart` | Cart page |
| `/checkout` | Multi-step checkout |
| `/checkout/callback` | Squad payment return handler |
| `/verify?sn=SERIAL` | Digital Watch Passport verification |
| `/about` | Brand story |
| `/contact` | Contact form |
| `/care` | Watch care guide |
| `/warranty` | Warranty information |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Customer Account
| URL | Description |
|-----|-------------|
| `/account/login` | Customer sign in |
| `/account/register` | Create account |
| `/account` | Dashboard |
| `/account/orders` | Order history |
| `/account/wishlist` | Saved products |
| `/account/addresses` | Saved addresses |
| `/account/settings` | Change password |

### Admin Panel (requires admin role)
| URL | Description |
|-----|-------------|
| `/admin/login` | Admin sign in |
| `/admin/dashboard` | KPI overview |
| `/admin/watches` | Watch registry + QR generator |
| `/admin/products` | Product management |
| `/admin/products/new` | Add new product |
| `/admin/products/[id]/edit` | Edit product |
| `/admin/orders` | Order management + status updates |
| `/admin/collections` | Collection management |
| `/admin/categories` | Category management |
| `/admin/logs` | Scan log viewer |
| `/admin/account` | Admin account settings |

---

## Squad Payment Flow

```
Checkout form
  → POST /api/orders          (create pending order)
  → POST /api/payments/squad/initiate   (get Squad checkout URL)
  → Redirect to Squad hosted checkout
  → Customer pays
  → Squad redirects to /checkout/callback?transaction_ref=XXX
  → GET /api/payments/squad/verify      (verify with Squad API)
  → Order confirmed, stock decremented, cart cleared
  → Squad also fires POST /api/payments/squad/webhook (HMAC-verified)
```

Set your Squad webhook URL to:
```
https://yourdomain.com/api/payments/squad/webhook
```

---

## Data Models

| Model | Purpose |
|-------|---------|
| `Admin` | Admin/superadmin users |
| `Watch` | Watch registry for Digital Passport |
| `ScanLog` | Verification attempt audit log (TTL 90 days) |
| `Product` | Ecommerce products with full specs |
| `Category` | Product categories |
| `Collection` | Curated collections |
| `Customer` | Customer accounts |
| `Cart` | Session-based shopping cart (TTL 7 days) |
| `Order` | Complete order records |
| `Payment` | Squad payment transaction records |
| `Wishlist` | Customer saved products |
| `Coupon` | Discount codes (percentage or fixed) |

---

## Seeded Demo Data

### Categories (10)
Men's Watches · Women's Watches · Unisex · Classic · Sport · Luxury · Limited Edition · New Arrivals · Best Sellers · Signature Collection

### Collections (3)
- **Eternal Reign** — flagship (featured)
- **Midnight Sovereign** — all-black DLCS (featured)
- **Lagos Gold Rush** — bold chronographs

### Products (8)
| Name | Price | Type |
|------|-------|------|
| QG Eternal Reign I | ₦485,000 | Best Seller, Men's |
| QG Midnight Sovereign I | ₦695,000 | New Arrival, Luxury (10% off) |
| QG Lagos Gold Rush Chrono | ₦395,000 | New Arrival, Men's |
| QG Sovereign Lady Rose | ₦320,000 | Best Seller, Women's |
| QG Eternal Reign GMT | ₦575,000 | New Arrival, Men's |
| QG Crown Limited 001/100 | ₦1,850,000 | Limited Edition |
| QG Sport Diver Pro | ₦285,000 | Best Seller, Sport (on sale) |
| QG Classic Dress Silver | ₦220,000 | Classic, Men's |

---

## Deployment (Vercel + MongoDB Atlas)

1. Push repo to GitHub
2. Import to Vercel
3. Add all environment variables in Vercel dashboard
4. Set `SQUAD_ENV=live` and use live Squad keys for production
5. Add your domain to `next.config.mjs` → `images.remotePatterns`
6. Run ecommerce seed against production DB:
   ```bash
   MONGODB_URI=<atlas-uri> npm run seed:all
   ```
7. Set Squad webhook URL to `https://yourdomain.com/api/payments/squad/webhook`

---

## File Count: 116 files

All TypeScript, zero JavaScript. Production-ready architecture with proper separation of concerns, server components where possible, client components only where interactivity is required.

---

*Queen Gold — Authentic Luxury Timepieces · Lagos, Nigeria*
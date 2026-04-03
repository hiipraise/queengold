# Queen Gold — Luxury Ecommerce Platform
## Complete Implementation Guide v2.0

---

## What Was Built

A full-stack premium ecommerce platform on top of the existing Queen Gold codebase, preserving all watch verification/admin functionality while adding a complete luxury shopping experience.

---

## New File Structure

```
queen-gold/
│
├── lib/
│   ├── models/
│   │   ├── Product.ts          ← Full product model with specs, flags, variants
│   │   ├── Category.ts         ← Hierarchical category system
│   │   ├── Collection.ts       ← Curated collection model
│   │   ├── Customer.ts         ← Customer accounts with bcrypt auth
│   │   ├── Cart.ts             ← Session-based cart with TTL expiry
│   │   ├── Order.ts            ← Complete order lifecycle model
│   │   ├── Payment.ts          ← Squad payment record model
│   │   ├── Wishlist.ts         ← Wishlist + Coupon models
│   │   ├── Admin.ts            ← (existing)
│   │   ├── Watch.ts            ← (existing)
│   │   └── ScanLog.ts          ← (existing)
│   │
│   ├── contexts/
│   │   ├── CartContext.tsx     ← Client cart state + server sync
│   │   └── WishlistContext.tsx ← Client wishlist with localStorage
│   │
│   ├── auth.ts                 ← Extended: Admin + Customer credentials
│   └── utils.ts                ← Extended: formatPrice, toKobo, slugify
│
├── components/
│   ├── Navbar.tsx              ← Full luxury navbar with search + cart
│   ├── CartDrawer.tsx          ← Slide-out cart panel
│   ├── ProductCard.tsx         ← Product grid card with quick-add
│   ├── Footer.tsx              ← Full site footer with links
│   ├── AdminNav.tsx            ← Updated: new ecommerce nav links
│   ├── QueenGoldLogo.tsx       ← (existing)
│   └── WatchPassport.tsx       ← (existing, preserved)
│
├── app/
│   ├── page.tsx                ← Premium homepage
│   ├── layout.tsx              ← Updated: CartProvider + WishlistProvider
│   │
│   ├── shop/
│   │   ├── page.tsx            ← Server: Shop catalog with SSR filtering
│   │   └── ShopClient.tsx      ← Client: Filters, sort, pagination
│   │
│   ├── products/[slug]/
│   │   ├── page.tsx            ← Server: Product detail + metadata
│   │   └── ProductDetailClient.tsx ← Client: Gallery, cart, specs, tabs
│   │
│   ├── collections/
│   │   ├── page.tsx            ← Collections gallery
│   │   └── [slug]/page.tsx     ← Collection detail with products
│   │
│   ├── checkout/
│   │   ├── page.tsx            ← Multi-step checkout form + Squad payment
│   │   └── callback/page.tsx   ← Payment return handler (verify + confirm)
│   │
│   ├── account/
│   │   ├── page.tsx            ← Account dashboard with orders
│   │   ├── login/page.tsx      ← Customer login
│   │   ├── register/page.tsx   ← Customer registration
│   │   └── orders/page.tsx     ← Order history
│   │
│   ├── api/
│   │   ├── cart/
│   │   │   ├── route.ts        ← GET/POST/DELETE cart
│   │   │   ├── [itemId]/route.ts ← PATCH/DELETE cart item
│   │   │   └── coupon/route.ts ← POST validate + apply coupon
│   │   │
│   │   ├── products/
│   │   │   ├── route.ts        ← GET products list (public)
│   │   │   └── [slug]/route.ts ← GET single product (public)
│   │   │
│   │   ├── orders/route.ts     ← POST create order, GET customer orders
│   │   │
│   │   ├── payments/squad/
│   │   │   ├── initiate/route.ts ← POST → Squad checkout URL
│   │   │   ├── verify/route.ts   ← GET verify transaction after redirect
│   │   │   └── webhook/route.ts  ← POST Squad webhook (HMAC-verified)
│   │   │
│   │   ├── wishlist/route.ts   ← GET/POST wishlist (server sync)
│   │   │
│   │   ├── customers/
│   │   │   └── register/route.ts ← POST register customer
│   │   │
│   │   └── admin/
│   │       ├── products/route.ts       ← GET/POST admin products
│   │       ├── products/[id]/route.ts  ← GET/PATCH/DELETE single product
│   │       ├── categories/route.ts     ← GET/POST categories
│   │       ├── collections/route.ts    ← GET/POST collections
│   │       ├── orders/route.ts         ← GET orders list
│   │       ├── orders/[id]/route.ts    ← GET/PATCH single order
│   │       ├── watches/...             ← (existing, preserved)
│   │       ├── logs/...                ← (existing, preserved)
│   │       ├── qr/...                  ← (existing, preserved)
│   │       └── account/...             ← (existing, preserved)
│   │
│   └── admin/(protected)/
│       ├── dashboard/page.tsx  ← KPI dashboard with revenue/orders
│       ├── products/page.tsx   ← Product management table
│       ├── orders/page.tsx     ← Order management with status updates
│       ├── watches/...         ← (existing, preserved)
│       ├── logs/...            ← (existing, preserved)
│       └── account/...         ← (existing, preserved)
│
├── scripts/
│   ├── seed.ts                 ← (existing) Admin + watch seed
│   └── seed-ecommerce.ts       ← NEW: Categories, collections, products
│
├── middleware.ts               ← Updated: guards /admin + /account/* routes
├── .env.example                ← Updated: Squad keys added
└── next.config.mjs             ← Updated: image domains, security headers
```

---

## Quick Setup

### 1. Copy environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` — the critical new variables:
```env
# Squad by GTBank (get from https://dashboard.squadco.com/)
SQUAD_SECRET_KEY=sandbox_sk_xxxxxxxxxxxxxxxxxxxx
SQUAD_PUBLIC_KEY=sandbox_pk_xxxxxxxxxxxxxxxxxxxx
SQUAD_ENV=sandbox   # change to "live" for production
```

### 2. Install dependencies
```bash
npm install
```

### 3. Seed the database
```bash
# Seed admin + watches (existing)
npm run seed

# Seed ecommerce data (categories, collections, products)
npm run seed:ecommerce

# Or both at once
npm run seed:all
```

### 4. Run development server
```bash
npm run dev
```

---

## Squad Payment Integration

### Flow
```
Customer → Checkout Form → POST /api/orders (create order)
    → POST /api/payments/squad/initiate (get Squad checkout URL)
    → Redirect to Squad hosted checkout
    → Customer pays on Squad
    → Squad redirects to /checkout/callback?transaction_ref=XXX
    → GET /api/payments/squad/verify (verify with Squad API)
    → Order confirmed, stock decremented, cart cleared
    → Squad also fires POST /api/payments/squad/webhook (HMAC-verified)
```

### Webhook Setup
In your Squad dashboard, set the webhook URL to:
```
https://yourdomain.com/api/payments/squad/webhook
```

The webhook is HMAC-SHA512 verified using your `SQUAD_SECRET_KEY`.

### Sandbox Testing
Use Squad's sandbox card numbers from: https://docs.squadco.com/

---

## Key Architecture Decisions

### Cart
- Session-based (no auth required) using `sessionStorage` for session ID
- Stored in MongoDB with 7-day TTL auto-expiry
- Guest cart → upgradeable to customer cart on login
- Real-time stock validation on add + during checkout

### Authentication
- Two credential providers: `admin-credentials` and `credentials` (customer)
- Middleware routes: `/admin/*` → requires admin/superadmin role; `/account/orders|wishlist|addresses|settings` → requires any session
- Customer login page at `/account/login` (not `/admin/login`)

### Wishlist
- Guest: persisted in `localStorage` (client-side only)
- Logged-in: synced to MongoDB `Wishlist` collection
- Toggle UI updates instantly (optimistic); server sync is fire-and-forget

### Product Images
- Reference image URLs (Cloudinary, CDN, or local `/public`)
- Add your CDN domain to `next.config.mjs` → `images.remotePatterns`
- Default placeholder shown when no image provided

### Pricing
- All prices stored in **whole Naira** (₦) in MongoDB
- Squad requires **kobo** — use `toKobo(price)` before sending to Squad API
- `formatPrice()` uses `Intl.NumberFormat` for Nigerian locale formatting

---

## Admin Panel — New Routes

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | KPI overview: revenue, orders, products, customers |
| `/admin/products` | Product CRUD with feature flag toggles |
| `/admin/products/new` | (requires page implementation) |
| `/admin/orders` | Order list with inline status + tracking updates |
| `/admin/collections/new` | (requires page implementation) |
| `/admin/categories/new` | (requires page implementation) |
| `/admin/watches` | (existing — watch registry) |
| `/admin/logs` | (existing — scan logs) |

---

## Customer Features

| Feature | URL | Status |
|---------|-----|--------|
| Browse shop | `/shop` | Complete |
| Filter by category/gender | `/shop?category=mens-watches` | Complete |
| Filter by type | `/shop?filter=new\|bestseller\|limited\|sale` | Complete |
| Search | `/shop?q=term` | Complete |
| Product detail | `/products/[slug]` | Complete |
| Collections | `/collections` | Complete |
| Collection detail | `/collections/[slug]` | Complete |
| Cart drawer | Slide-out on any page | Complete |
| Checkout | `/checkout` | Complete |
| Payment (Squad) | Redirect to Squad | Complete |
| Payment callback | `/checkout/callback` | Complete |
| Create account | `/account/register` | Complete |
| Login | `/account/login` | Complete |
| Account dashboard | `/account` | Complete |
| Order history | `/account/orders` | Complete |
| Wishlist | Toggle on product cards | Complete |
| Watch verification | `/verify` | Preserved |

---

## Extending the Platform

### Adding a product form (Admin)
Create `/app/admin/(protected)/products/new/page.tsx` as a client component that POSTs to `/api/admin/products`.

### Adding Cloudinary image upload
```bash
npm install cloudinary next-cloudinary
```
Add `CLOUDINARY_URL` to `.env.local` and use the `CldUploadWidget` in the product form.

### Adding Redis rate limiting
```bash
npm install rate-limiter-flexible ioredis
```
Replace the in-memory store in `lib/rate-limit.ts` (documented in existing README).

### Enabling email confirmations
Add `nodemailer` and configure `SMTP_*` env vars. Fire emails from the Squad webhook handler after `order.paymentStatus === "paid"`.

### Multi-currency support
Squad supports NGN, USD, GBP. Update `currency` field in order creation and pass `currency` to the initiation endpoint.

---

## Preserved Features (Unchanged)

All existing features are fully preserved and integrated:

- **Watch Registry** — `/admin/watches` — register, edit, delete watches
- **QR Code Generator** — download high-res PNG QR codes per watch
- **Digital Watch Passport** — `/verify?sn=SERIAL` — public verification page
- **Scan Logs** — every verification attempt logged with IP, timestamp, result
- **Rate Limiting** — 10 requests/min per IP on `/api/verify`
- **Admin Auth** — `admin-credentials` NextAuth provider

The verify page is also linked from product detail pages (warranty tab) and the homepage as a trust-building ecommerce feature.

---

## Product Categories (Seeded)

1. Men's Watches
2. Women's Watches
3. Unisex
4. Classic
5. Sport
6. Luxury
7. Limited Edition
8. New Arrivals
9. Best Sellers
10. Signature Collection

## Collections (Seeded)

1. **Eternal Reign** — flagship collection (featured)
2. **Midnight Sovereign** — all-black DLCS (featured)
3. **Lagos Gold Rush** — bold chronographs

## Demo Products (Seeded)

1. QG Eternal Reign I — ₦485,000 (Best Seller, Men's)
2. QG Midnight Sovereign I — ₦695,000 (New Arrival, Luxury, 10% off)
3. QG Lagos Gold Rush Chrono — ₦395,000 (New Arrival, Men's)
4. QG Sovereign Lady Rose — ₦320,000 (Best Seller, Women's)
5. QG Eternal Reign GMT — ₦575,000 (New Arrival, Men's)
6. QG Crown Limited 001/100 — ₦1,850,000 (Limited Edition)
7. QG Sport Diver Pro — ₦285,000 (Best Seller, Sport, on sale)
8. QG Classic Dress Silver — ₦220,000 (Classic, Men's)

---

*Queen Gold Ecommerce Platform — Built with Next.js 14, MongoDB, NextAuth, Tailwind CSS, Squad by GTBank*

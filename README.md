# Queen Gold — Digital Watch Passport System

A full-stack QR-based authentication and verification platform for Queen Gold luxury timepieces, built with Next.js 14, MongoDB, and Tailwind CSS.

---

## Features

- **Public Verify Page** — `/verify?sn=SERIAL` — luxury Digital Watch Passport display
- **QR Code Flow** — scan QR → auto-fill serial → show passport
- **Admin Panel** — `/admin` — register watches, manage status, download QR codes
- **Scan Logs** — every verification attempt is logged (IP, timestamp, serial, result)
- **Rate Limiting** — 10 requests per IP per minute on `/api/verify`
- **Security** — unique serial constraint, uppercase normalization, session-protected admin
- **SEO-friendly** — `?sn=` URL param, proper metadata, no client-side-only rendering

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Framework  | Next.js 14 (App Router)                     |
| Database   | MongoDB via Mongoose                        |
| Auth       | NextAuth.js (credentials, JWT sessions)     |
| Styling    | Tailwind CSS + custom CSS variables         |
| QR Codes   | `qrcode` npm package                        |
| Fonts      | Playfair Display, Cormorant SC, Jost        |

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
NEXTAUTH_SECRET=your-random-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@queengold.com
ADMIN_PASSWORD=YourSecurePassword!
```

> Generate a secret: `openssl rand -base64 32`

### 3. Seed the database

```bash
npx tsx scripts/seed.ts
```

This creates:
- Admin user (using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`)
- 3 sample watches (serials: `Q04R7254`, `Q04R7255`, `Q04R7300`)

### 4. Run in development

```bash
npm run dev
```

Visit:
- **Verify page:** http://localhost:3000/verify
- **Admin login:** http://localhost:3000/admin/login
- **Test passport:** http://localhost:3000/verify?sn=Q04R7254

---

## Project Structure

```
queen-gold/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── verify/                # Public verification endpoint
│   │   └── admin/
│   │       ├── watches/           # CRUD for watches
│   │       ├── watches/[serial]/  # Single watch operations
│   │       ├── logs/              # Scan log viewer
│   │       └── qr/                # QR code generator
│   ├── verify/                    # Public verify page
│   ├── admin/
│   │   ├── login/                 # Admin login
│   │   ├── watches/               # Watch management
│   │   └── logs/                  # Scan logs
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── QueenGoldLogo.tsx          # SVG crown logo
│   ├── WatchPassport.tsx          # Digital passport card
│   └── AdminNav.tsx               # Admin navigation
├── lib/
│   ├── mongodb.ts                 # DB connection singleton
│   ├── models/
│   │   ├── Watch.ts               # Watch model + indexes
│   │   ├── ScanLog.ts             # Scan log model (TTL 90d)
│   │   └── Admin.ts               # Admin user model
│   ├── auth.ts                    # NextAuth config
│   ├── admin-guard.ts             # Admin session helper
│   ├── rate-limit.ts              # In-memory rate limiter
│   └── utils.ts                   # Shared utilities
├── middleware.ts                  # Edge auth guard for /admin
├── scripts/
│   └── seed.ts                    # DB seed script
└── types/
    └── next-auth.d.ts             # Session type extensions
```

---

## API Reference

### Public

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | `/api/verify?sn=XXX`  | Verify a serial number           |

**Rate limit:** 10 requests / 60 seconds per IP.

**Response (found):**
```json
{
  "found": true,
  "passport": {
    "serialNumber": "Q04R7254",
    "model": "QG-ER-01",
    "collection": "Eternal Reign",
    "movement": "CROWNCALIBRE™ CC-01",
    "status": "sold",
    "warrantyStatus": "active",
    "dateOfPurchase": "2024-11-12T00:00:00.000Z",
    "dealer": "Queen Gold Lagos",
    "scanCount": 3,
    "firstScannedAt": "2024-11-12T10:00:00.000Z"
  }
}
```

**Response (not found):**
```json
{ "found": false }
```

### Admin (requires session)

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | `/api/admin/watches`              | List all watches         |
| POST   | `/api/admin/watches`              | Register new watch       |
| GET    | `/api/admin/watches/:serial`      | Get single watch         |
| PATCH  | `/api/admin/watches/:serial`      | Update watch             |
| DELETE | `/api/admin/watches/:serial`      | Delete watch             |
| GET    | `/api/admin/logs`                 | View scan logs           |
| GET    | `/api/admin/qr?sn=XXX&size=1600` | Download high-resolution QR code PNG |

---

## Security Design

| Concern              | Implementation                                          |
|----------------------|---------------------------------------------------------|
| Serial uniqueness    | MongoDB unique index + Mongoose pre-save normalization  |
| Brute force          | In-memory rate limiter (10 req/min per IP)              |
| Audit trail          | Every `/api/verify` call logs IP, UA, serial, result    |
| Admin protection     | NextAuth JWT session + edge middleware                  |
| Data exposure        | `_id`, `__v`, `passwordHash` stripped from all responses|
| Serial normalization | Always stored as `UPPERCASE`, whitespace stripped       |
| Log TTL              | Scan logs auto-expire after 90 days                     |

### Production Rate Limiting (Redis)

For production, replace the in-memory store in `lib/rate-limit.ts` with a Redis-backed solution:

```bash
npm install rate-limiter-flexible ioredis
```

```ts
// lib/rate-limit.ts — Redis version
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL!);

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix:   "rl_verify",
  points:      10,
  duration:    60,
});
```

---

## QR Code Flow

1. Admin registers a watch with serial `Q04R7254`
2. Admin downloads QR code from the admin panel (links to `/verify?sn=Q04R7254`)
3. QR code is printed on warranty card / packaging
4. Customer scans QR → lands on `/verify?sn=Q04R7254`
5. Serial auto-fills → verification runs automatically
6. Digital Watch Passport is displayed

---

## Deployment (Vercel + MongoDB Atlas)

1. Push repo to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Use MongoDB Atlas connection string for `MONGODB_URI`
5. Run seed against production DB once:
   ```bash
   MONGODB_URI=<atlas-uri> npx tsx scripts/seed.ts
   ```

---

## Future: NFC Integration

The system is designed to extend to NFC. Each NFC tag can encode the same URL (`/verify?sn=SERIAL`). No backend changes needed — the verify endpoint is already URL-param driven.

To add NFC write capability to the admin panel:

```ts
// Future admin feature
const ndef = new NDEFReader();
await ndef.write({
  records: [{ recordType: "url", data: `https://queengold.com/verify?sn=${serial}` }]
});
```

---

## License

Private — Queen Gold internal use only.

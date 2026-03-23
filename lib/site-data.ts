export type ProductCategory =
  | "Men’s Watches"
  | "Women’s Watches"
  | "Unisex"
  | "Classic"
  | "Sport"
  | "Luxury"
  | "Limited Edition"
  | "New Arrivals"
  | "Best Sellers"
  | "Signature Collection";

export interface Category {
  slug: string;
  name: ProductCategory;
  description: string;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  sku: string;
  serialNumber: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  category: ProductCategory;
  collection: string;
  description: string;
  story: string;
  specs: { label: string; value: string }[];
  movement: string;
  material: string;
  warranty: string;
  badge?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  images: string[];
}

export const categories: Category[] = [
  { slug: "mens-watches", name: "Men’s Watches", description: "Architectural silhouettes and assertive complications crafted for contemporary collectors." },
  { slug: "womens-watches", name: "Women’s Watches", description: "Elegant diamond-set and refined bracelet watches with couture finishing." },
  { slug: "unisex", name: "Unisex", description: "Versatile profiles designed to move effortlessly between wardrobes and occasions." },
  { slug: "classic", name: "Classic", description: "Timeless case shapes, guilloché dials, and elevated dress-watch signatures." },
  { slug: "sport", name: "Sport", description: "High-performance chronographs and dive-ready builds for dynamic lifestyles." },
  { slug: "luxury", name: "Luxury", description: "Hero pieces in precious metals and signature finishing for statement wear." },
  { slug: "limited-edition", name: "Limited Edition", description: "Strictly allocated references reserved for Queen Gold’s private clientele." },
  { slug: "new-arrivals", name: "New Arrivals", description: "Fresh launches and latest interpretations of our house collections." },
  { slug: "best-sellers", name: "Best Sellers", description: "The most sought-after signatures chosen by collectors across the region." },
  { slug: "signature-collection", name: "Signature Collection", description: "The defining Queen Gold icons that express the maison’s identity." },
];

export const collections: Collection[] = [
  { slug: "eternal-reign", name: "Eternal Reign", tagline: "Classic prestige refined.", description: "Dress-forward references with fluted bezels, mirror-finished lugs, and ceremonial presence." },
  { slug: "obsidian-sport", name: "Obsidian Sport", tagline: "Performance with ceremony.", description: "Integrated sport-luxury silhouettes featuring ceramic accents and precision chronograph calibres." },
  { slug: "celestial-signature", name: "Celestial Signature", tagline: "The rarest expression of the house.", description: "Limited production references combining skeletonised movements, precious metals, and numbered passports." },
];

const img = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

export const products: Product[] = [
  {
    slug: "eternal-reign-royal-40",
    name: "Eternal Reign Royal 40",
    sku: "QG-ER-40-RG",
    serialNumber: "Q04R7254",
    price: 18500,
    discountPercentage: 10,
    stock: 3,
    category: "Luxury",
    collection: "Eternal Reign",
    description: "A rose-gold dress watch with sunray burgundy dial, applied indices, and a palace-inspired bracelet.",
    story: "The Royal 40 is the signature collector’s reference: balanced proportions, commanding warmth, and a digital passport that documents provenance from boutique to wrist.",
    movement: "CROWNCALIBRE™ CC-01 automatic",
    material: "18k rose gold-plated steel, sapphire crystal, alligator leather",
    warranty: "5-year international warranty with digital passport activation",
    badge: "Signature",
    featured: true,
    bestSeller: true,
    images: [img('photo-1523170335258-f5ed11844a49'), img('photo-1547996160-81dfa63595aa'), img('photo-1612817159949-195b6eb9e31a')],
    specs: [
      { label: 'Case Size', value: '40mm' },
      { label: 'Water Resistance', value: '100m' },
      { label: 'Power Reserve', value: '72 hours' },
      { label: 'Dial', value: 'Sunray burgundy with applied baton indices' },
    ],
  },
  {
    slug: "obsidian-sport-chrono",
    name: "Obsidian Sport Chronograph",
    sku: "QG-OS-42-BK",
    serialNumber: "Q04R7255",
    price: 14200,
    stock: 8,
    category: "Sport",
    collection: "Obsidian Sport",
    description: "An integrated chronograph with black ceramic bezel and gold-accent pushers.",
    story: "Built for travel, racing, and private aviation schedules, the Obsidian Sport merges technical edge with Queen Gold opulence.",
    movement: "CROWNCALIBRE™ CC-07 automatic chronograph",
    material: "Brushed steel, black ceramic bezel, rubber strap",
    warranty: "5-year international warranty",
    badge: "Chronograph",
    featured: true,
    newArrival: true,
    images: [img('photo-1508057198894-247b23fe5ade'), img('photo-1522312346375-d1a52e2b99b3'), img('photo-1524592094714-0f0654e20314')],
    specs: [
      { label: 'Case Size', value: '42mm' },
      { label: 'Water Resistance', value: '200m' },
      { label: 'Functions', value: 'Chronograph, date, tachymeter' },
      { label: 'Dial', value: 'Matte black tri-compax layout' },
    ],
  },
  {
    slug: "celestial-signature-skeleton",
    name: "Celestial Signature Skeleton",
    sku: "QG-CS-39-LE",
    serialNumber: "Q04R7300",
    price: 26800,
    stock: 1,
    category: "Limited Edition",
    collection: "Celestial Signature",
    description: "A numbered skeleton watch with meteorite chapter ring and diamond-polished bridge architecture.",
    story: "Only 25 examples exist, each accompanied by an individually registered digital passport and concierge verification story.",
    movement: "CROWNCALIBRE™ Atelier S-88 hand-wound",
    material: "Titanium, 18k gold accents, sapphire front and back",
    warranty: "7-year maison coverage plus white-glove annual service",
    badge: "Limited 1 of 25",
    featured: true,
    images: [img('photo-1542496658-e33a6d0d50f6'), img('photo-1511370235399-1802cae1d32f'), img('photo-1524805444758-089113d48a6d')],
    specs: [
      { label: 'Case Size', value: '39mm' },
      { label: 'Edition', value: 'Limited to 25 pieces' },
      { label: 'Power Reserve', value: '96 hours' },
      { label: 'Dial', value: 'Skeletonised with meteorite chapter ring' },
    ],
  },
  {
    slug: "monarch-classic-33",
    name: "Monarch Classic 33",
    sku: "QG-MC-33-IV",
    serialNumber: "Q04R7401",
    price: 9600,
    stock: 6,
    category: "Women’s Watches",
    collection: "Eternal Reign",
    description: "A compact ivory-dial bracelet watch with diamond minute track and hidden butterfly clasp.",
    story: "For evenings of quiet confidence, the Monarch Classic is jewellery and precision in equal measure.",
    movement: "CROWNCALIBRE™ CC-03 automatic",
    material: "Polished steel with diamond-set bezel",
    warranty: "5-year international warranty",
    bestSeller: true,
    images: [img('photo-1434056886845-dac89ffe9b56'), img('photo-1483985988355-763728e1935b'), img('photo-1523170335258-f5ed11844a49')],
    specs: [
      { label: 'Case Size', value: '33mm' },
      { label: 'Water Resistance', value: '50m' },
      { label: 'Dial', value: 'Ivory mother-of-pearl' },
      { label: 'Bracelet', value: 'Five-link hidden clasp bracelet' },
    ],
  },
  {
    slug: "voyager-gmt-41",
    name: "Voyager GMT 41",
    sku: "QG-VG-41-BL",
    serialNumber: "Q04R7402",
    price: 11800,
    stock: 5,
    category: "Men’s Watches",
    collection: "Obsidian Sport",
    description: "A dual-time luxury travel watch with midnight-blue ceramic bezel and champagne GMT hand.",
    story: "Designed for global tastemakers, the Voyager GMT pairs utility with polished lounge-ready detailing.",
    movement: "CROWNCALIBRE™ GMT-12 automatic",
    material: "Steel, ceramic bezel, brushed bracelet",
    warranty: "5-year international warranty",
    newArrival: true,
    images: [img('photo-1523170335258-f5ed11844a49'), img('photo-1507679799987-c73779587ccf'), img('photo-1491553895911-0055eca6402d')],
    specs: [
      { label: 'Case Size', value: '41mm' },
      { label: 'Water Resistance', value: '150m' },
      { label: 'Functions', value: 'GMT, date' },
      { label: 'Dial', value: 'Blue lacquer with applied lume markers' },
    ],
  },
  {
    slug: "atelier-dual-heart-36",
    name: "Atelier Dual Heart 36",
    sku: "QG-AD-36-RS",
    serialNumber: "Q04R7403",
    price: 12400,
    stock: 4,
    category: "Unisex",
    collection: "Celestial Signature",
    description: "A sculpted tonneau case with open-heart aperture and satin blush dial for contemporary collectors.",
    story: "A conversation piece that softens technical watchmaking with fashion-house sensibility.",
    movement: "CROWNCALIBRE™ Atelier Open 5",
    material: "Steel with rose satin finish, integrated leather strap",
    warranty: "5-year international warranty",
    featured: true,
    images: [img('photo-1518546305927-5a555bb7020d'), img('photo-1523381210434-271e8be1f52b'), img('photo-1522312346375-d1a52e2b99b3')],
    specs: [
      { label: 'Case Size', value: '36mm' },
      { label: 'Water Resistance', value: '30m' },
      { label: 'Dial', value: 'Blush satin with open-heart aperture' },
      { label: 'Strap', value: 'Quick-release calfskin' },
    ],
  },
];

export const featuredProducts = products.filter((product) => product.featured);
export const bestSellers = products.filter((product) => product.bestSeller);
export const newArrivals = products.filter((product) => product.newArrival);

export const trustHighlights = [
  { title: 'Digital Passport Verification', text: 'Every watch includes an authenticity lookup tied to its serial number and ownership history.' },
  { title: 'White-Glove Concierge', text: 'Appointments, sourcing support, and aftercare are managed by Queen Gold advisors.' },
  { title: 'Maison Warranty', text: 'Luxury packaging, insured dispatch, and warranty enrolment are built into every order.' },
];

export const customer = {
  name: 'Amina Cole',
  email: 'amina.cole@example.com',
  tier: 'Private Client',
  addresses: [
    { label: 'Primary', line1: '14 Admiralty Way', city: 'Lekki', state: 'Lagos', country: 'Nigeria' },
    { label: 'Studio', line1: 'West 57th Street', city: 'New York', state: 'NY', country: 'USA' },
  ],
  orders: [
    { id: 'QG-1024', date: '2026-02-08', total: 18500, status: 'Delivered', items: 1 },
    { id: 'QG-0948', date: '2025-12-17', total: 12400, status: 'Processing', items: 1 },
  ],
};

export const promotions = [
  { code: 'FIRSTCLASS', title: 'Private client welcome', detail: 'Unlock 5% off your first online order and concierge setup.' },
  { code: 'PASSPORTCARE', title: 'Complimentary warranty registration', detail: 'Digital passport enrollment included with new arrivals.' },
];

export const squadConfig = {
  docsUrl: 'https://docs.squadco.com/',
  initEndpoint: 'https://sandbox-api-d.squadco.com/transaction/init',
  verifyEndpoint: 'https://sandbox-api-d.squadco.com/transaction/verify/:transaction_ref',
};

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

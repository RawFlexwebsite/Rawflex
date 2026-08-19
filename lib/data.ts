export const SITE = {
  name: "RAWFLEX",
  tagline: "Streetwear. Built Different.",
  email: "rawflexinfo@gmail.com",
  phone: "+91 63872 17330",
  phoneHref: "+916387217330",
  whatsapp: "916387217330",
  whatsappMessage: "Hi RAWFLEX! I'd like to know more about your collection.",
  city: "Kanpur, Uttar Pradesh, India",
  address: "15/4 B.P Colony, Kidwai Nagar, Kanpur",
  instagram: "rawflex.in",
  facebook: "rawflex rawflex",
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  count: string;
};

export const categories: Category[] = [
  {
    id: "new-drops",
    name: "New Drops",
    description: "Fresh silhouettes hitting the racks every week — cop before they're gone.",
    image: "/categories/new-drops.png",
    count: "24 styles",
  },
  {
    id: "best-sellers",
    name: "Best Sellers",
    description: "The pieces everyone's repping. Restocked weekly, sold out fast.",
    image: "/categories/best-sellers.png",
    count: "18 styles",
  },
  {
    id: "oversized-tees",
    name: "Oversized Tees",
    description: "Heavyweight cotton tees with boxy fits and bold graphic prints.",
    image: "/categories/oversized-tees.png",
    count: "32 styles",
  },
  {
    id: "acid-wash",
    name: "Acid Wash",
    description: "Distressed, faded and one-of-one — every wash job is unique.",
    image: "/categories/acid-wash.png",
    count: "12 styles",
  },
  {
    id: "gym-collection",
    name: "Gym Collection",
    description: "Moisture-wicking comfort for the grind. Built to move, styled to flex.",
    image: "/categories/gym-collection.png",
    count: "16 styles",
  },
  {
    id: "streetwear-collection",
    name: "Streetwear Collection",
    description: "The core drop — hoodies, cargo, jackets and the fits that define the culture.",
    image: "/categories/streetwear-collection.png",
    count: "28 styles",
  },
  {
    id: "limited-edition",
    name: "Limited Edition",
    description: "Numbered runs that never restock. When it's gone, it's gone.",
    image: "/categories/limited-edition.png",
    count: "8 styles",
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  rating: number;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "RAW Flex Heavyweight Oversized Tee — Black",
    category: "Oversized Tees",
    price: 1299,
    oldPrice: 1599,
    image: "/products/oversized-tee-black.png",
    badge: "Bestseller",
    rating: 4.9,
  },
  {
    id: "p2",
    name: "Acid Wash Distressed Tee — Washed Grey",
    category: "Acid Wash",
    price: 1499,
    image: "/products/acid-wash-grey.png",
    badge: "New",
    rating: 4.8,
  },
  {
    id: "p3",
    name: "FlexFit Gym Training Tee — Neon Detail",
    category: "Gym Collection",
    price: 999,
    oldPrice: 1299,
    image: "/products/gym-tee.png",
    badge: "Hot",
    rating: 4.7,
  },
  {
    id: "p4",
    name: "Limited Edition Logo Hoodie — Numbered Drop",
    category: "Limited Edition",
    price: 2499,
    oldPrice: 2999,
    image: "/products/hoodie-limited.png",
    badge: "Limited",
    rating: 4.9,
  },
  {
    id: "p5",
    name: "Street Cargo Pants — Olive",
    category: "Streetwear Collection",
    price: 1799,
    oldPrice: 2199,
    image: "/products/cargo-olive.png",
    rating: 4.6,
  },
  {
    id: "p6",
    name: "Graphic Oversized Tee — 'FLEX' Print",
    category: "Oversized Tees",
    price: 1399,
    image: "/products/oversized-tee-flex.png",
    badge: "New Drop",
    rating: 4.8,
  },
  {
    id: "p7",
    name: "Acid Wash Denim Jacket — Faded Blue",
    category: "Acid Wash",
    price: 2799,
    image: "/products/acid-wash-jacket.png",
    rating: 4.5,
  },
  {
    id: "p8",
    name: "Athleisure Joggers — Tech Fabric",
    category: "Gym Collection",
    price: 1599,
    image: "/products/gym-joggers.png",
    badge: "Popular",
    rating: 4.7,
  },
];

export type Testimonial = {
  name: string;
  city: string;
  quote: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Rohan S.",
    city: "Kanpur",
    quote:
      "The oversized tee fit was spot on. Heavy fabric, clean print — you can tell the quality the moment you touch it.",
    initials: "RS",
  },
  {
    name: "Aditya V.",
    city: "Lucknow",
    quote:
      "Copped the acid wash hoodie and it's genuinely one-of-one. Every wash turns heads. RAWFLEX doesn't miss.",
    initials: "AV",
  },
  {
    name: "Ishaan M.",
    city: "Delhi",
    quote:
      "Messaged them on WhatsApp at night and got a reply in minutes. Delivery was fast and the fit guide was clutch.",
    initials: "IM",
  },
  {
    name: "Karan T.",
    city: "Bengaluru",
    quote:
      "Gym collection is underrated. Wicks sweat better than brands charging double. Already copped two more tees.",
    initials: "KT",
  },
];

export const usps = [
  {
    title: "Heavyweight Fabric",
    description: "240 GSM cotton and tech blends built for daily wear, washes and the streets — not for a single season.",
  },
  {
    title: "One-Of-One Finishes",
    description: "Acid washes and distressed prints that make every single piece genuinely unique.",
  },
  {
    title: "Fit That Flexes",
    description: "Oversized, boxy and athlete-tested silhouettes engineered to look right on every build.",
  },
  {
    title: "Pan-India Shipping",
    description: "Dispatched from Kanpur with tracked delivery across India, plus easy size exchanges.",
  },
];

export const navLinks = [
  { label: "New Drops", href: "/shop?category=new-drops" },
  { label: "Collections", href: "/shop" },
  { label: "Best Sellers", href: "/shop?category=best-sellers" },
  { label: "About", href: "/about" },
];

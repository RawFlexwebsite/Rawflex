import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";

const bestSellers = [
  {
    name: "Urbanic Box Tee",
    price: 999,
    reviews: 120,
    image: "/products/oversized-tee-black.png",
  },
  {
    name: "Mindset Tee",
    price: 1099,
    reviews: 98,
    image: "/products/oversized-tee-flex.png",
  },
  {
    name: "Washed Black Tee",
    price: 1099,
    reviews: 101,
    image: "/products/acid-wash-grey.png",
  },
  {
    name: "Butterfly Tee",
    price: 1199,
    reviews: 90,
    image: "/products/hoodie-limited.png",
  },
  {
    name: "Eternal Tee",
    price: 1199,
    reviews: 99,
    image: "/products/gym-tee.png",
  },
  {
    name: "Discipline Tee",
    price: 1199,
    reviews: 105,
    image: "/products/cargo-olive.png",
  },
];

const lookbook = [
  "/lookbook-1.jpg",
  "/lookbook-2.jpg",
  "/lookbook-3.jpg",
  "/lookbook-4.jpg",
  "/lookbook-5.jpg",
];

function formatINR(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function SectionTitle({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-5">
      <h2 className="font-display text-3xl font-black uppercase leading-none text-white md:text-4xl">
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-2 text-[11px] font-black uppercase text-[#D4A82C] transition-all hover:gap-3 md:text-sm"
      >
        {label}
        <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
      </Link>
    </div>
  );
}

function Rating({ reviews }: { reviews: number }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-[#D4A82C]">
        {[0, 1, 2, 3, 4].map((star) => (
          <Star key={star} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>
      <span className="text-[12px] font-bold text-white/70">({reviews})</span>
    </div>
  );
}

export default function BestSellersLookbook() {
  return (
    <section className="relative bg-[#0a0909] pb-12 pt-6 md:pb-16 md:pt-8">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <SectionTitle title="Best Sellers" href="/shop?category=best-sellers" label="View All" />

        <div className="relative">
          <div className="grid grid-flow-col auto-cols-[72%] gap-3 overflow-x-auto pb-2 no-scrollbar sm:auto-cols-[48%] md:auto-cols-[30%] lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible lg:pb-0">
            {bestSellers.map((item, index) => {
              const zoomOutImage = [0, 2, 3, 4].includes(index);
              const isSmallCard = [0, 2, 3, 4].includes(index);

              return (
              <Link
                key={item.name}
                href="/shop?category=best-sellers"
                className="group block min-w-0"
              >
                <div className="relative aspect-[1.55/1] overflow-hidden border border-white/20 bg-[#f1efeb]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 48vw, (max-width: 1280px) 30vw, 220px"
                    className={
                      isSmallCard
                        ? "object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        : zoomOutImage
                        ? "scale-90 object-contain object-center transition-transform duration-700 group-hover:scale-95"
                        : "object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    }
                  />
                </div>
                <div className="pt-3 sm:pt-4">
                  <h3 className="line-clamp-1 text-[12px] sm:text-[13px] font-black uppercase leading-none text-white/70 transition-colors group-hover:text-[#D4A82C] md:text-[15px]">
                    {item.name}
                  </h3>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-black text-white md:text-base">
                    {formatINR(item.price)}
                  </p>
                  <Rating reviews={item.reviews} />
                </div>
              </Link>
              );
            })}
          </div>

          <Link
            href="/shop?category=best-sellers"
            aria-label="View best sellers"
            className="absolute -right-3 top-[28%] hidden h-14 w-14 items-center justify-center rounded-full border border-[#D4A82C]/60 bg-[#0a0909]/90 text-[#D4A82C] shadow-[0_0_0_3px_rgba(0,0,0,0.7)] transition-colors hover:bg-[#D4A82C] hover:text-[#0a0909] lg:flex"
          >
            <ChevronRight className="h-8 w-8" />
          </Link>
        </div>

        <div className="mt-10 md:mt-12 lg:mt-14">
          <SectionTitle title="Lookbook" href="/shop" label="View All Looks" />

          <div className="grid grid-flow-col auto-cols-[78%] gap-0 overflow-x-auto no-scrollbar border border-white/10 sm:auto-cols-[48%] md:auto-cols-[30%] lg:grid-flow-row lg:grid-cols-5 lg:overflow-hidden">
            {lookbook.map((src, index) => (
              <Link
                key={src}
                href="/shop"
                className="group relative aspect-[1.55/1] overflow-hidden bg-[#111110]"
              >
                <Image
                  src={src}
                  alt={`RAWFLEX lookbook style ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 48vw, (max-width: 1280px) 30vw, 280px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

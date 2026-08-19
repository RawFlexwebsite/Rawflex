"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface NewDropProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image_url: string;
  badge?: string;
  category_name?: string;
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function NewDrops({
  products = [],
}: {
  products?: NewDropProduct[];
}) {
  const { addToCart } = useCart();
  const items = products.slice(0, 4);

  return (
    <section id="new-drops" className="relative pt-4 pb-10 md:pt-5 md:pb-14 bg-[#0a0909]">
      <div className="max-w-wrap mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* Left copy */}
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase leading-[1.05]">
              New Drops
            </h2>
            <p className="mt-3 sm:mt-4 text-white/50 text-sm sm:text-base leading-relaxed">
              Fresh styles.
              <br />
              Limited pieces.
              <br />
              Get yours before
              <br />
              it&apos;s gone.
            </p>
            <Link
              href="/shop?category=new-drops"
              className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-[#D4A82C] font-bold text-[12px] sm:text-[13px] tracking-[0.12em] uppercase hover:gap-3 transition-all"
            >
              View all drops
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
              </svg>
            </Link>
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {items.map((p) => {
              const price = p.sale_price && p.sale_price < p.price ? p.sale_price : p.price;
              return (
                <div key={p.id} className="group overflow-hidden rounded-md border border-white/10 hover:border-[#D4A82C]/50 transition-colors">
                  <Link href={`/shop/${p.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[#EDEAE4]">
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 300px"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-[#D4A82C] text-[#0a0909] text-[10px] font-bold uppercase tracking-wider">
                      New
                    </span>
                  </Link>
                  <div className="bg-[#111110] px-4 py-3.5">
                    <Link href={`/shop/${p.id}`}>
                      <p className="text-white/70 text-[11px] font-semibold uppercase tracking-wide leading-snug line-clamp-1 hover:text-[#D4A82C] transition-colors">
                        {p.name}
                      </p>
                    </Link>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-white font-bold text-[15px]">
                        {formatINR(price)}
                      </span>
                      <button
                        onClick={() =>
                          addToCart({
                            id: p.id,
                            name: p.name,
                            price,
                            image_url: p.image_url,
                            category_name: p.category_name || "New Drops",
                          })
                        }
                        aria-label="Add to cart"
                        className="flex items-center justify-center w-8 h-8 shrink-0 border border-[#D4A82C] text-[#D4A82C] hover:bg-[#D4A82C] hover:text-[#0a0909] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

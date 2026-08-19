"use client";

import Image from "next/image";
import { useState } from "react";

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image_url: string;
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const slides = [
  {
    tag: "NEW SEASON '24",
    headline1: "MADE FOR",
    headline2: "THE STREETS",
    sub: "Oversized silhouettes. Premium fabrics.\nDesigned to move with you.",
    cta: "SHOP NEW DROPS",
    ctaHref: "/shop?category=new-drops",
  },
  {
    tag: "LIMITED DROP '24",
    headline1: "BORN FOR",
    headline2: "THE GRIND",
    sub: "Heavyweight washes. One-of-one designs.\nBuilt different, shipped pan-India.",
    cta: "EXPLORE COLLECTION",
    ctaHref: "/shop",
  },
  {
    tag: "EXCLUSIVE DROP",
    headline1: "DEFINE",
    headline2: "YOUR STYLE",
    sub: "Raw. Bold. Unapologetic.\nSmall batch drops that sell out fast.",
    cta: "SHOP NOW",
    ctaHref: "/shop?featured=true",
  },
];

export default function Hero({
  featuredProducts = [],
}: {
  featuredProducts?: FeaturedProduct[];
}) {
  const [current, setCurrent] = useState(0);
  const featured = featuredProducts.slice(0, 2);
  const slide = slides[current];
  const total = slides.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#0a0909]"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Full-bleed environment background ── */}
      <div className="absolute inset-x-0 z-0" style={{ top: "13%", height: "100%" }}>
        <Image
          src="/hero-img.png"
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0909] via-[#0a0909]/50 to-[#0a0909]/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0909]/90 via-transparent to-[#0a0909]/40" />
      </div>

      {/* ── Model cutout ── */}
      <div
        className="hidden md:block absolute z-[5] bottom-0 pointer-events-none"
        style={{ right: "27%", top: "120px", width: "40%" }}
      >
        <Image
          src="/hero-parts.png"
          alt="Model wearing RAWFLEX oversized tee"
          fill
          priority
          sizes="40vw"
          className="object-contain object-bottom"
        />
      </div>

      {/* ── Main content grid ── */}
      <div
        className="relative z-10 max-w-wrap mx-auto px-5 md:px-10 flex items-start lg:items-center pt-[124px] pb-8 lg:pt-[120px] lg:pb-[60px]"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-16 items-center">

          {/* ── LEFT: Copy ── */}
          <div>
            {/* Season tag */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#D4A82C] text-xs font-bold tracking-[0.22em] uppercase">
                {slide.tag}
              </span>
              <span className="w-10 h-[1.5px] bg-[#D4A82C]" />
            </div>

            {/* Headline */}
            <h1 className="font-black uppercase leading-[0.92] tracking-tight whitespace-nowrap">
              <span
                className="block text-white"
                style={{ fontSize: "clamp(1.85rem, 6vw, 5.25rem)" }}
              >
                {slide.headline1}
              </span>
              <span
                className="block normal-case"
                style={{
                  fontSize: "clamp(1.65rem, 5.5vw, 4.75rem)",
                  color: "#D4A82C",
                  fontFamily: "var(--font-marker)",
                  fontWeight: 400,
                  transform: "rotate(-2deg)",
                  transformOrigin: "left center",
                }}
              >
                {slide.headline2}
              </span>
            </h1>

            {/* Sub */}
            <p
              className="mt-3 max-w-[440px] text-[11px] md:text-base leading-relaxed whitespace-pre-line"
              style={{ color: "rgba(220,215,210,0.65)" }}
            >
              {slide.sub}
            </p>

            {/* CTA */}
            <div className="flex justify-start mt-5 lg:mt-9">
              <a
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 border border-[#D4A82C] text-[#D4A82C] font-bold text-[10px] md:text-sm tracking-[0.18em] uppercase px-5 py-3 md:px-7 md:py-4 hover:bg-[#D4A82C] hover:text-[#0a0909] transition-all duration-300"
              >
                {slide.cta}
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Mobile model image ── */}
          <div className="lg:hidden w-screen -mx-5 mt-4 pointer-events-none relative overflow-hidden">
            <Image
              src="/hero-parts.png"
              alt="Model wearing RAWFLEX oversized tee"
              width={800}
              height={1060}
              priority
              sizes="100vw"
              style={{ width: "100%", height: "auto", display: "block", transform: "translateX(12%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a0909] to-transparent" />
          </div>

          {/* ── RIGHT: Product cards + nav ── */}
          <div className="hidden lg:flex flex-col gap-5 w-[290px] xl:w-[320px]">
            {/* Product Cards */}
            {featured.length > 0 ? (
              featured.map((p) => (
                <a
                  key={p.id}
                  href="/shop?category=new-drops"
                  className="group flex items-center gap-5 rounded-sm border border-white/15 bg-white/5 backdrop-blur-sm hover:border-[#D4A82C]/60 hover:bg-white/10 transition-all duration-300 overflow-hidden p-4"
                >
                  {/* Image */}
                  <div className="relative w-[112px] h-[112px] shrink-0 overflow-hidden bg-[#1a1a1a] rounded-sm">
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      sizes="112px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 py-1 bg-[#D4A82C] text-[#0a0909] text-[10px] font-bold uppercase tracking-widest mb-2">
                      NEW DROP
                    </span>
                    <h3 className="text-white font-bold text-[15px] uppercase leading-snug line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-[#D4A82C] font-bold text-[17px]">
                      {p.sale_price && p.sale_price < p.price
                        ? formatINR(p.sale_price)
                        : formatINR(p.price)}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[#D4A82C] text-[12px] font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                      SHOP NOW
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <>
                {[
                  { name: "CHAOS BLOOM TEE", price: 1299 },
                  { name: "LIMITED EDITION 001 TEE", price: 1499 },
                ].map((p, i) => (
                  <a
                    key={i}
                    href="/shop?category=new-drops"
                    className="group flex items-center gap-5 rounded-sm border border-white/15 bg-white/5 backdrop-blur-sm hover:border-[#D4A82C]/60 hover:bg-white/10 transition-all duration-300 overflow-hidden p-4"
                  >
                    <div className="relative w-[112px] h-[112px] shrink-0 overflow-hidden bg-[#1a1a1a] rounded-sm">
                      <Image
                        src={i === 0 ? "/lookbook-1.jpg" : "/lookbook-2.jpg"}
                        alt={p.name}
                        fill
                        sizes="112px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2.5 py-1 bg-[#D4A82C] text-[#0a0909] text-[10px] font-bold uppercase tracking-widest mb-2">
                        NEW DROP
                      </span>
                      <h3 className="text-white font-bold text-[15px] uppercase leading-snug">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-[#D4A82C] font-bold text-[17px]">
                        {formatINR(p.price)}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[#D4A82C] text-[12px] font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                        SHOP NOW
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                        </svg>
                      </span>
                    </div>
                  </a>
                ))}
              </>
            )}

            {/* Slide counter + nav */}
            <div className="flex items-center justify-end gap-4 mt-1">
              <span className="text-white/60 text-xs font-bold tracking-widest">
                {String(current + 1).padStart(2, "0")}
                <span className="mx-2 text-white/30">——</span>
                {String(total).padStart(2, "0")}
              </span>
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4A82C] hover:text-[#D4A82C] transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4A82C] hover:text-[#D4A82C] transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile product strip ── */}
      <div className="lg:hidden relative z-10 px-4 sm:px-5 pb-8 grid grid-cols-2 gap-3 sm:gap-4">
        {(featured.length > 0 ? featured : [
          { id: "1", name: "CHAOS BLOOM TEE", price: 1299, image_url: "/lookbook-1.jpg" },
          { id: "2", name: "LIMITED EDITION 001", price: 1499, image_url: "/lookbook-2.jpg" },
        ] as FeaturedProduct[]).map((p) => (
          <a
            key={p.id}
            href="/shop?category=new-drops"
            className="group block rounded-sm border border-white/10 bg-[#111]/80 overflow-hidden"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
              <Image
                src={p.image_url}
                alt={p.name}
                fill
                sizes="50vw"
                className="object-cover object-center"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#D4A82C] text-[#0a0909] text-[9px] font-bold uppercase tracking-widest">
                NEW
              </span>
            </div>
            <div className="p-3">
              <p className="text-white text-[11px] sm:text-[12px] font-bold uppercase leading-snug line-clamp-2">
                {p.name}
              </p>
              <p className="mt-1 text-[#D4A82C] font-bold text-[13px] sm:text-[14px]">
                {p.sale_price && p.sale_price < p.price
                  ? formatINR(p.sale_price)
                  : formatINR(p.price)}
              </p>
            </div>
          </a>
        ))}

        {/* Mobile nav */}
        <div className="col-span-2 flex items-center justify-center gap-3 sm:gap-4 pt-3">
          <button onClick={prev} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center text-white">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white/50 text-xs sm:text-sm tracking-widest font-bold">
            {String(current + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </span>
          <button onClick={next} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center text-white">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

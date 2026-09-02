"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSlide {
  id?: string;
  tag?: string;
  title?: string | null;
  subtitle?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  image_url?: string | null;
}

interface HeroBackgroundImage {
  id?: string;
  image_url: string;
}

interface HeroLeftText {
  eyebrow: string;
  headline_top: string;
  headline_accent: string;
  subtitle: string;
  button_text: string;
  button_link: string;
}

const DEFAULT_HERO_LEFT_TEXT: HeroLeftText = {
  eyebrow: "NEW SEASON '24",
  headline_top: "MADE FOR",
  headline_accent: "THE STREETS",
  subtitle: "Oversized silhouettes. Premium fabrics.\nDesigned to move with you.",
  button_text: "SHOP NOW",
  button_link: "/shop",
};

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    title: "NEW SEASON '24",
    subtitle: "Oversized silhouettes. Premium fabrics.",
    button_text: "SHOP NOW",
    button_link: "/shop",
    image_url: "/hero-img.webp",
  },
  {
    title: "LIMITED DROP '24",
    subtitle: "Heavyweight washes. One-of-one designs.",
    button_text: "EXPLORE",
    button_link: "/shop",
    image_url: "https://bwudwdyzqkvpbymheybq.supabase.co/storage/v1/object/public/rawflex/hero/hero-main.jpg",
  },
  {
    title: "EXCLUSIVE DROP",
    subtitle: "Raw. Bold. Unapologetic.",
    button_text: "SHOP NOW",
    button_link: "/shop?featured=true",
    image_url: "https://bwudwdyzqkvpbymheybq.supabase.co/storage/v1/object/public/rawflex/lookbook/lookbook-1.jpg",
  },
  {
    title: "RAWFLEX STREETWEAR",
    subtitle: "Streetwear. Built Different.",
    button_text: "SHOP NOW",
    button_link: "/shop",
    image_url: "https://bwudwdyzqkvpbymheybq.supabase.co/storage/v1/object/public/rawflex/lookbook/lookbook-2.jpg",
  },
];

function slideLines(slide: HeroSlide) {
  const lines = (slide.title || "").split("\n");
  return {
    line1: lines[0] || "RAWFLEX",
    line2: lines[1] || "",
    label: slide.button_text || "VIEW",
    link: slide.button_link || "/shop",
  };
}

function isLocalPublicImage(src?: string | null) {
  return !!src && src.startsWith("/");
}

export default function Hero({
  slides = [],
  backgroundImages = [],
  leftText = DEFAULT_HERO_LEFT_TEXT,
}: {
  slides?: HeroSlide[];
  backgroundImages?: HeroBackgroundImage[];
  leftText?: HeroLeftText;
}) {
  const [current, setCurrent] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const slidesData = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const heroBackgroundImages = backgroundImages;

  useEffect(() => {
    if (heroBackgroundImages.length <= 1) return;

    const timer = setInterval(() => {
      setBackgroundIndex((i) => (i + 1) % heroBackgroundImages.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [heroBackgroundImages.length]);

  const pairs: HeroSlide[][] = [];
  for (let i = 0; i < slidesData.length; i += 2) {
    pairs.push([slidesData[i], slidesData[i + 1] || slidesData[i]]);
  }
  const totalPairs = Math.max(pairs.length, 1);
  const [cardA, cardB] = pairs[current % totalPairs] || pairs[0];
  const a = slideLines(cardA);
  const b = slideLines(cardB);

  const prev = () => setCurrent((c) => (c - 1 + totalPairs) % totalPairs);
  const next = () => setCurrent((c) => (c + 1) % totalPairs);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#0a0909]"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Full-bleed environment background ── */}
      <div className="absolute inset-x-0 z-0" style={{ top: "13%", height: "100%" }}>
        {heroBackgroundImages.map((background, i) => {
          const isCurrent = i === backgroundIndex % heroBackgroundImages.length;

          return (
            <Image
              key={background.id || background.image_url}
              src={background.image_url}
              alt="Hero background"
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover object-center transition-opacity duration-700 ${
                isCurrent ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
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
          src="/hero-parts.webp"
          alt="Model wearing RAWFLEX oversized tee"
          fill
          priority
          unoptimized
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

          {/* ── LEFT: Static brand copy ── */}
          <div>
            {/* Season tag */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#D4A82C] text-xs font-bold tracking-[0.22em] uppercase">
                {leftText.eyebrow}
              </span>
              <span className="w-10 h-[1.5px] bg-[#D4A82C]" />
            </div>

            {/* Headline */}
            <h1 className="font-black uppercase leading-[0.92] tracking-tight whitespace-nowrap">
              <span
                className="block text-white"
                style={{ fontSize: "clamp(1.85rem, 6vw, 5.25rem)" }}
              >
                {leftText.headline_top}
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
                {leftText.headline_accent}
              </span>
            </h1>

            {/* Sub */}
            <p
              className="mt-3 max-w-[440px] text-[11px] md:text-base leading-relaxed whitespace-pre-line"
              style={{ color: "rgba(220,215,210,0.65)" }}
            >
              {leftText.subtitle}
            </p>

            {/* CTA */}
            <div className="flex justify-start mt-5 lg:mt-9">
              <a
                href={leftText.button_link}
                className="inline-flex items-center gap-2 border border-[#D4A82C] text-[#D4A82C] font-bold text-[10px] md:text-sm tracking-[0.18em] uppercase px-5 py-3 md:px-7 md:py-4 hover:bg-[#D4A82C] hover:text-[#0a0909] transition-all duration-300"
              >
                {leftText.button_text}
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
               src="/hero-parts.webp"
               alt="Model wearing RAWFLEX oversized tee"
               width={800}
               height={1060}
               priority
               unoptimized
               sizes="100vw"
               style={{ width: "100%", height: "auto", display: "block", transform: "translateX(12%)" }}
             />
             <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a0909] to-transparent" />
           </div>

          {/* ── RIGHT: Two slide cards + nav ── */}
          <div className="hidden lg:flex flex-col gap-5 w-[290px] xl:w-[320px]">
            {/* Slide Card A */}
            <a
              href={a.link}
              className="group flex items-center gap-5 rounded-sm border border-white/15 bg-white/5 backdrop-blur-sm hover:border-[#D4A82C]/60 hover:bg-white/10 transition-all duration-300 overflow-hidden p-4"
            >
              <div className="relative w-[112px] h-[112px] shrink-0 overflow-hidden bg-[#1a1a1a] rounded-sm">
                <Image
                  src={cardA.image_url || "/hero-img.png"}
                  alt={a.line1}
                  fill
                  unoptimized={isLocalPublicImage(cardA.image_url || "/hero-img.png")}
                  sizes="112px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-1 bg-[#D4A82C] text-[#0a0909] text-[10px] font-bold uppercase tracking-widest mb-2">
                  {a.line1}
                </span>
                <p className="text-white/70 text-[12px] uppercase leading-snug line-clamp-2">
                  {a.line2}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[#D4A82C] text-[12px] font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                  {a.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                  </svg>
                </span>
              </div>
            </a>

            {/* Slide Card B */}
            <a
              href={b.link}
              className="group flex items-center gap-5 rounded-sm border border-white/15 bg-white/5 backdrop-blur-sm hover:border-[#D4A82C]/60 hover:bg-white/10 transition-all duration-300 overflow-hidden p-4"
            >
              <div className="relative w-[112px] h-[112px] shrink-0 overflow-hidden bg-[#1a1a1a] rounded-sm">
                <Image
                  src={cardB.image_url || "/hero-img.png"}
                  alt={b.line1}
                  fill
                  unoptimized={isLocalPublicImage(cardB.image_url || "/hero-img.png")}
                  sizes="112px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-1 bg-[#D4A82C] text-[#0a0909] text-[10px] font-bold uppercase tracking-widest mb-2">
                  {b.line1}
                </span>
                <p className="text-white/70 text-[12px] uppercase leading-snug line-clamp-2">
                  {b.line2}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[#D4A82C] text-[12px] font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                  {b.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                  </svg>
                </span>
              </div>
            </a>

            {/* Slide counter + nav */}
            <div className="flex items-center justify-end gap-4 mt-1">
              <span className="text-white/60 text-xs font-bold tracking-widest">
                {String(current + 1).padStart(2, "0")}
                <span className="mx-2 text-white/30">——</span>
                {String(totalPairs).padStart(2, "0")}
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

      {/* ── Mobile slide strip ── */}
      <div className="lg:hidden relative z-10 px-4 sm:px-5 pb-8 grid grid-cols-2 gap-3 sm:gap-4">
        {[cardA, cardB].map((slide) => {
          const s = slideLines(slide);
          return (
            <a
              key={slide.id || s.line1}
              href={s.link}
              className="group block rounded-sm border border-white/10 bg-[#111]/80 overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={slide.image_url || "/hero-img.png"}
                  alt={s.line1}
                  fill
                  unoptimized={isLocalPublicImage(slide.image_url || "/hero-img.png")}
                  sizes="50vw"
                  className="object-cover object-center"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#D4A82C] text-[#0a0909] text-[9px] font-bold uppercase tracking-widest">
                  {s.line1}
                </span>
              </div>
              <div className="p-3">
                <p className="text-white text-[11px] sm:text-[12px] font-bold uppercase leading-snug line-clamp-2">
                  {s.line2 || s.label}
                </p>
                <p className="mt-1 text-[#D4A82C] font-bold text-[13px] sm:text-[14px]">
                  {s.label}
                </p>
              </div>
            </a>
          );
        })}

        {/* Mobile nav */}
        <div className="col-span-2 flex items-center justify-center gap-3 sm:gap-4 pt-3">
          <button onClick={prev} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center text-white">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white/50 text-xs sm:text-sm tracking-widest font-bold">
            {String(current + 1).padStart(2, "0")} — {String(totalPairs).padStart(2, "0")}
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

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type OversizedSectionSettings = {
  background_image_url: string;
  headline_top: string;
  headline_accent: string;
  subtitle: string;
  button_text: string;
  button_link: string;
};

const DEFAULT_SETTINGS: OversizedSectionSettings = {
  background_image_url: "/OVERSIZED..webp",
  headline_top: "Oversized.",
  headline_accent: "Always.",
  subtitle: "Relaxed fit. Maximum impact.",
  button_text: "Shop Oversized",
  button_link: "/shop?category=oversized-tees",
};

export default function OversizedPromo({
  settings = DEFAULT_SETTINGS,
}: {
  settings?: OversizedSectionSettings;
}) {
  const isLocalBackgroundImage = settings.background_image_url.startsWith("/");

  return (
    <section className="relative bg-[#0a0909] py-4 md:py-5">
      <div className="max-w-wrap mx-auto px-5 md:px-8">

        {/* ── MOBILE layout ── */}
        <div className="block sm:hidden border border-[#D4A82C]/40 bg-[#0b0b0a] overflow-hidden shadow-[0_0_0_1px_rgba(212,168,44,0.08),0_22px_70px_-36px_rgba(212,168,44,0.45)]">

{/* Person image only — natural height, no blank space */}
           <div className="relative w-full pt-5 px-2">
             <Image
               src="/OVERSIZED_person.webp"
               alt="Model wearing an oversized black RAWFLEX tee"
               width={800}
               height={900}
               sizes="100vw"
               unoptimized
               style={{ width: "100%", height: "auto", display: "block" }}
             />
            {/* fade bottom into text */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0b0b0a] to-transparent" />
          </div>

          {/* Text block — sits directly below image */}
          <div className="px-6 pt-4 pb-7 text-center bg-[#0b0b0a]">
            <span className="block mx-auto mb-4 w-10 h-[2px] bg-[#D4A82C]" />
            <h2 className="font-display text-[34px] font-black uppercase leading-[0.92] text-white">
              <span className="block drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]">{settings.headline_top}</span>
              <span className="mt-1 block text-[#D4A82C] drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]">{settings.headline_accent}</span>
            </h2>
            <p className="mt-3 text-xs font-semibold tracking-wide text-white/60">
              {settings.subtitle}
            </p>
            <Link
              href={settings.button_link}
              className="group mt-5 inline-flex items-center justify-center gap-3 border border-[#D4A82C] px-7 py-3 text-[11px] font-black uppercase text-white transition-all duration-300 hover:bg-[#D4A82C] hover:text-[#0a0909]"
            >
              {settings.button_text}
              <ArrowRight className="h-4 w-4 text-[#D4A82C] transition-colors group-hover:text-[#0a0909]" />
            </Link>
          </div>
        </div>

        {/* ── DESKTOP layout (original, unchanged) ── */}
        <div className="hidden sm:block relative isolate min-h-[460px] overflow-hidden border border-[#D4A82C]/40 bg-[#0b0b0a] shadow-[0_0_0_1px_rgba(212,168,44,0.08),0_22px_70px_-36px_rgba(212,168,44,0.45)] lg:min-h-[350px] xl:min-h-[390px]">
          <Image
            src={settings.background_image_url}
            alt=""
            fill
            unoptimized={isLocalBackgroundImage}
            sizes="1400px"
            className="z-0 object-cover object-center"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-transparent via-[#0a0909]/10 to-[#0a0909]/75" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0909]/35 via-transparent to-[#0a0909]/10" />
          <div className="absolute inset-x-0 bottom-0 z-[2] h-[45%] sm:left-3 sm:h-[76%] md:left-8 md:h-[90%] lg:left-8 lg:h-[100%] lg:w-[46%]">
            <Image
              src="/OVERSIZED_person.webp"
              alt="Model wearing an oversized black RAWFLEX tee"
              fill
              unoptimized
              sizes="(max-width: 1024px) 60vw, 720px"
              className="object-contain object-bottom sm:object-left-bottom"
            />
          </div>
          <div className="absolute inset-x-auto bottom-auto right-6 top-1/2 z-[3] w-[40%] -translate-y-1/2 text-left lg:right-10 xl:right-14">
            <h2 className="font-display text-4xl font-black uppercase leading-[0.94] text-white md:text-5xl xl:text-6xl">
              <span className="block drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]">{settings.headline_top}</span>
              <span className="mt-2 block text-[#D4A82C] drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]">{settings.headline_accent}</span>
            </h2>
            <p className="mt-4 text-sm font-semibold text-white/75 md:text-base">
              {settings.subtitle}
            </p>
            <Link
              href={settings.button_link}
              className="group mt-6 inline-flex items-center justify-center gap-3 border border-[#D4A82C] px-7 py-3 text-[12px] font-black uppercase text-white transition-all duration-300 hover:bg-[#D4A82C] hover:text-[#0a0909]"
            >
              {settings.button_text}
              <ArrowRight className="h-5 w-5 text-[#D4A82C] transition-colors group-hover:text-[#0a0909]" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

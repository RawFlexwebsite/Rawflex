import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OversizedPromo() {
  return (
    <section className="relative bg-[#0a0909] py-4 md:py-5">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <div className="relative isolate min-h-[520px] overflow-hidden border border-[#D4A82C]/40 bg-[#0b0b0a] shadow-[0_0_0_1px_rgba(212,168,44,0.08),0_22px_70px_-36px_rgba(212,168,44,0.45)] sm:min-h-[460px] lg:min-h-[350px] xl:min-h-[390px]">
          <Image
            src="/OVERSIZED..png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1400px"
            className="z-0 object-cover object-center"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-transparent via-[#0a0909]/10 to-[#0a0909]/75" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0909]/35 via-transparent to-[#0a0909]/10" />

          <div className="absolute inset-x-0 bottom-0 z-[2] h-[58%] sm:left-3 sm:h-[76%] md:left-8 md:h-[90%] lg:left-8 lg:h-[100%] lg:w-[46%]">
            <Image
              src="/OVERSIZED_person.png"
              alt="Model wearing an oversized black RAWFLEX tee"
              fill
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 60vw, 720px"
              className="object-contain object-bottom sm:object-left-bottom"
            />
          </div>

          <div className="absolute inset-x-6 bottom-9 z-[3] text-center sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:w-[40%] sm:-translate-y-1/2 sm:text-left lg:right-10 xl:right-14">
            <h2 className="font-display text-[34px] font-black uppercase leading-[0.94] text-white sm:text-4xl md:text-5xl xl:text-6xl">
              <span className="block drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]">
                Oversized.
              </span>
              <span className="mt-2 block text-[#D4A82C] drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]">
                Always.
              </span>
            </h2>
            <p className="mt-4 text-xs font-semibold text-white/75 sm:text-sm md:text-base">
              Relaxed fit. Maximum impact.
            </p>
            <Link
              href="/shop?category=oversized-tees"
              className="group mt-6 inline-flex items-center justify-center gap-3 border border-[#D4A82C] px-6 py-3 text-[11px] font-black uppercase text-white transition-all duration-300 hover:bg-[#D4A82C] hover:text-[#0a0909] sm:px-7 sm:text-[12px]"
            >
              Shop Oversized
              <ArrowRight className="h-5 w-5 text-[#D4A82C] transition-colors group-hover:text-[#0a0909]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

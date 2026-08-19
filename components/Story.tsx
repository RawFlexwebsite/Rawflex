import Image from "next/image";
import Reveal from "./Reveal";
import BotanicalDivider from "./BotanicalDivider";
import { IconTulip } from "./Icons";

export default function Story() {
  return (
    <section id="story" className="relative py-12 md:py-16 bg-[#E4E0DD]">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative max-w-[460px] mx-auto">
              <div className="relative aspect-[5/6] rounded-[32px] overflow-hidden shadow-soft border border-[#E6DAC4]">
                <Image
                  src="/story-stock.png"
                  alt="RAWFLEX streetwear in the wild"
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 md:-bottom-8 -left-4 md:-left-8 bg-white rounded-2xl shadow-card px-5 py-4 max-w-[200px] border border-[#E6DAC4]">
                <p className="font-display font-bold text-2xl text-[#B9893F] leading-none">
                  3+
                </p>
                <p className="text-xs text-[#5A5550] font-medium mt-1">
                  Years on the streets
                </p>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2 flex flex-col items-center text-center lg:py-4">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[13px] md:text-sm font-bold tracking-[0.25em] uppercase text-[#8A6A26]">
                <IconTulip className="w-4 h-4 text-[#B9893F]" />
                Our Story
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl text-[#0B0C0B] uppercase tracking-wide">
                Built in Kanpur,
                <br />
                made for the streets.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-5 text-[#5A5550] font-body text-sm md:text-base max-w-[520px] mx-auto leading-relaxed">
                RAWFLEX started with a simple idea — streetwear that feels as
                good as it looks. Heavyweight fabric that survives the daily
                grind, acid washes you won't find anywhere else, and fits that
                move with you. Every piece is designed, printed and packed in
                Kanpur.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <p className="mt-4 text-[#5A5550] font-body text-sm md:text-base max-w-[520px] mx-auto leading-relaxed">
                No fast-fashion shortcuts. Just drops we're proud to put our
                name on, shipped to every corner of India.
              </p>
            </Reveal>
            <Reveal delay={4} className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 w-full">
              <div className="flex flex-col items-center">
                <p className="font-display font-bold text-2xl text-[#B9893F]">
                  120+
                </p>
                <p className="text-xs text-[#5A5550] font-medium mt-0.5">
                  Drops delivered
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display font-bold text-2xl text-[#B9893F]">
                  24
                </p>
                <p className="text-xs text-[#5A5550] font-medium mt-0.5">
                  States shipped to
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display font-bold text-2xl text-[#B9893F]">
                  5,000+
                </p>
                <p className="text-xs text-[#5A5550] font-medium mt-0.5">
                  Flexers styled
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      <BotanicalDivider tone="gold" />
    </section>
  );
}
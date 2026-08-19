import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Story from "@/components/Story";
import BotanicalDivider from "@/components/BotanicalDivider";

export const metadata = {
  title: 'About Us | RAWFLEX',
  description: 'Learn about the story behind RAWFLEX — streetwear built in Kanpur and made for the streets.',
}

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden pt-[108px] md:pt-[120px] bg-cream min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Banner for About Page */}
      <section className="relative w-full py-16 md:py-24 bg-emerald-deep flex items-center justify-center overflow-hidden border-b border-cream-line">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/50 to-black/70 opacity-80" />
        
        <div className="relative z-10 text-center px-5">
          <div className="eyebrow justify-center inline-flex items-center gap-2 mb-3 text-gold-light">
            <span className="h-px w-6 bg-gold-light/50" />
            The Story
            <span className="h-px w-6 bg-gold-light/50" />
          </div>
          <h1 className="font-display font-semibold text-3xl md:text-5xl text-white tracking-tight">
            About RAWFLEX
          </h1>
          <p className="mt-4 text-white/80 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Heavyweight streetwear, one-of-one washes and limited drops — built in Kanpur, made for the streets.
          </p>
        </div>
      </section>

      <BotanicalDivider tone="emerald" />

      <div className="flex-1">
        {/* We reuse the Story component which has the core information */}
        <Story />
      </div>

      <Footer />
    </main>
  );
}

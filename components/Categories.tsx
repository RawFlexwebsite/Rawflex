import Image from "next/image";
import Reveal from "./Reveal";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  count?: string | number;
}

export default function Categories({ categories = [] }: { categories?: Category[] }) {
  return (
    <section id="categories" className="relative bg-[#0a0909] pt-8 pb-4 md:pt-10 md:pb-5">
      <div className="max-w-wrap mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 md:gap-3">
          {categories.slice(0, 7).map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 5) as any}>
              <a
                href={`/shop?category=${cat.id}`}
                className="group relative block aspect-[10/19] overflow-hidden rounded-md border border-white/10 hover:border-[#D4A82C]/50 transition-colors"
              >
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-3.5 sm:right-3.5">
                  <h3 className="font-display font-bold text-white uppercase leading-[1.08] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                    {cat.name}
                  </h3>
                  <svg
                    className="mt-2 w-5 h-5 sm:mt-3 sm:w-6 sm:h-6 text-[#D4A82C]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

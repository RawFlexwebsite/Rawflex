import Link from "next/link";
import { Instagram, Mail, Music2, Youtube } from "lucide-react";
import { SITE } from "@/lib/data";

const shopLinks = [
  { label: "New Drops", href: "/shop?category=new-drops" },
  { label: "Best Sellers", href: "/shop?category=best-sellers" },
  { label: "Oversized Tees", href: "/shop?category=oversized-tees" },
  { label: "Acid Wash", href: "/shop?category=acid-wash" },
  { label: "Gym Collection", href: "/shop?category=gym-collection" },
  { label: "Streetwear Collection", href: "/shop?category=streetwear-collection" },
  { label: "Limited Edition", href: "/shop?category=limited-edition" },
];

const helpLinks = [
  { label: "Track Order", href: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi RAWFLEX! Can you help me track my order?")}` },
  { label: "Shipping", href: "/policies/shipping" },
  { label: "Returns", href: "/policies/refund" },
  { label: "FAQ", href: "/contact#faq" },
  { label: "Size Guide", href: "/shop" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Story", href: "/about" },
  { label: "Careers", href: "/contact" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms & Conditions", href: "/policies/terms" },
];

const infoLinks = [
  { label: "Store Locator", href: "/contact" },
  { label: "Contact Us", href: "/contact" },
  { label: "Affiliates", href: "/contact" },
];

const payments = ["VISA", "MC", "UPI", "Paytm"];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0909] pb-8 pt-3">
      <div className="max-w-wrap mx-auto px-5 md:px-8">
        <section className="border border-[#D4A82C]/30 bg-[#090a09] px-5 py-5 shadow-[0_0_0_1px_rgba(212,168,44,0.08)] md:px-8 lg:px-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.08fr]">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center text-[#D4A82C] md:h-16 md:w-16">
                <Mail className="h-11 w-11 stroke-[1.6] md:h-12 md:w-12" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-black uppercase leading-none text-white md:text-3xl">
                  Be the first to know
                </h2>
                <p className="mt-2 text-sm font-semibold text-white/55">
                  New drops, exclusive offers & more.
                </p>
              </div>
            </div>

            <form className="flex min-w-0 flex-col sm:flex-row" action="/shop">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-12 min-w-0 flex-1 border border-[#D4A82C]/35 bg-[#070807] px-5 text-sm font-semibold text-white outline-none placeholder:text-white/45 focus:border-[#D4A82C] md:h-14"
              />
              <button
                type="submit"
                className="h-12 shrink-0 bg-[#D4A82C] px-7 text-xs font-black uppercase text-[#0a0909] transition-colors hover:bg-[#e2bd50] md:h-14 lg:px-10"
              >
                Join the List
              </button>
            </form>
          </div>
        </section>

        <div className="grid gap-10 px-2 pt-9 md:grid-cols-2 lg:grid-cols-[1.5fr_0.85fr_0.85fr_1fr_0.85fr_1.25fr] lg:gap-8">
          <div>
            <Link
              href="/"
              className="font-display text-3xl font-black uppercase leading-none text-[#D4A82C]"
            >
              RAWFLEX.
            </Link>
            <p className="mt-5 max-w-[210px] text-sm font-semibold leading-relaxed text-white/55">
              Built for the streets.
              <br />
              Worn by the culture.
            </p>
            <div className="mt-6 flex items-center gap-5 text-white">
              <a
                href={`https://www.instagram.com/${SITE.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-[#D4A82C]"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="/"
                aria-label="TikTok"
                className="transition-colors hover:text-[#D4A82C]"
              >
                <Music2 className="h-6 w-6" />
              </a>
              <a
                href="/"
                aria-label="YouTube"
                className="transition-colors hover:text-[#D4A82C]"
              >
                <Youtube className="h-7 w-7" />
              </a>
              <a
                href="/"
                aria-label="Pinterest"
                className="font-display text-2xl font-black leading-none transition-colors hover:text-[#D4A82C]"
              >
                P
              </a>
            </div>
            <p className="mt-7 text-xs font-semibold text-white/45">
              (c) {new Date().getFullYear()} RAWFLEX. All rights reserved.
            </p>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Help" links={helpLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Info" links={infoLinks} />

          <div className="lg:pt-10">
            <h3 className="text-sm font-black uppercase text-[#D4A82C]">We Accept</h3>
            <div className="mt-7 flex flex-nowrap items-center gap-5 overflow-x-auto no-scrollbar">
              {payments.map((payment) => (
                <PaymentMark key={payment} name={payment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PaymentMark({ name }: { name: string }) {
  if (name === "MC") {
    return (
      <span aria-label="Mastercard" className="relative block h-7 w-12">
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-[#eb001b]" />
        <span className="absolute left-5 top-1 h-5 w-5 rounded-full bg-[#f79e1b] mix-blend-screen" />
      </span>
    );
  }

  if (name === "UPI") {
    return (
      <span className="flex items-center text-[19px] font-black italic tracking-tight text-white">
        UPI
        <span className="ml-1 h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[#D4A82C]" />
      </span>
    );
  }

  if (name === "Paytm") {
    return (
      <span className="text-[20px] font-black tracking-tight text-white">
        Paytm
      </span>
    );
  }

  return (
    <span className="text-[20px] font-black italic tracking-tight text-white">
      VISA
    </span>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase text-white/75">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm font-semibold text-white/55 transition-colors hover:text-[#D4A82C]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

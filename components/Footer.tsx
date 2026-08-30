"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Youtube, Loader2 } from "lucide-react";
import { IconWhatsapp } from "@/components/Icons";
import { SITE } from "@/lib/data";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

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
  { label: "FAQ", href: "/faq" },
  { label: "Size Guide", href: "/shop" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Story", href: "/about" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms & Conditions", href: "/policies/terms" },
];

const infoLinks = [
  { label: "Contact Us", href: "/contact" },
];

const payments = ["VISA", "MC", "UPI", "Paytm"];

const socialLinks = [
  {
    label: "Instagram",
    href: `https://www.instagram.com/${SITE.instagram.replace("@", "")}`,
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@rawflex",
    icon: Youtube,
    className: "h-6 w-6 sm:h-7 sm:w-7",
  },
  {
    label: "Facebook",
    href: `https://www.facebook.com/${SITE.facebook.replace(/\s+/g, "")}`,
    icon: Facebook,
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`,
    icon: IconWhatsapp,
  },
];

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Failed to subscribe. Please try again.', 'error')
        return
      }

      showToast('Successfully subscribed to newsletter!', 'success')
      e.currentTarget.reset()
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="relative bg-[#0a0909] pb-8 pt-3">
      <div className="max-w-wrap mx-auto px-4 sm:px-5 md:px-8">
        <section className="border border-[#D4A82C]/30 bg-[#090a09] px-4 sm:px-5 py-5 sm:py-5 md:px-8 md:py-5 lg:px-10 shadow-[0_0_0_1px_rgba(212,168,44,0.08)]">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 justify-between">

            {/* Icon + heading — always in a row, compact on mobile */}
            <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto">
              <div className="flex h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 items-center justify-center text-[#D4A82C]">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-2xl md:text-3xl font-black uppercase leading-tight text-white">
                  Be the first to know
                </h2>
                <p className="mt-1 text-[11px] sm:text-sm font-semibold text-white/55">
                  New drops, exclusive offers &amp; more.
                </p>
              </div>
            </div>

            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto sm:flex-1 sm:justify-center" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="w-full min-w-0 sm:w-[300px] border border-[#D4A82C]/35 bg-[#070807] px-4 py-3 text-sm font-semibold text-center text-white outline-none placeholder:text-white/45 placeholder:text-center focus:border-[#D4A82C] rounded-xl transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto shrink-0 bg-[#D4A82C] px-6 py-3 text-sm font-black uppercase text-[#0a0909] rounded-xl transition-colors hover:bg-[#e2bd50] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join the List'}
              </button>
            </form>
          </div>
        </section>

        <div className="grid gap-6 sm:gap-8 md:gap-10 px-2 pt-8 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)_1.25fr] lg:gap-8">
          <div>
            <Link
              href="/"
              className="font-display text-2xl sm:text-3xl font-black uppercase leading-none text-[#D4A82C]"
            >
              RAWFLEX.
            </Link>
            <p className="mt-4 sm:mt-5 max-w-[210px] text-xs sm:text-sm font-semibold leading-relaxed text-white/55">
              Built for the streets.
              <br />
              Worn by the culture.
            </p>
            <div className="mt-4 sm:mt-6 flex items-center gap-4 sm:gap-5 text-white">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="transition-colors hover:text-[#D4A82C]"
                  >
                    <Icon className={social.className ?? "h-5 w-5 sm:h-6 sm:w-6"} />
                  </a>
                );
              })}
            </div>
            <p className="mt-5 sm:mt-7 text-[10px] sm:text-xs font-semibold text-white/45">
              (c) {new Date().getFullYear()} RAWFLEX. All rights reserved.
            </p>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Help" links={helpLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Info" links={infoLinks} />

          <div className="lg:pt-8">
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

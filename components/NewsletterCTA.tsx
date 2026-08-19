"use client";

import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section className="relative py-16 md:py-24 bg-cream border-t border-cream-line">
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-panel border border-gold/40 flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
          </svg>
        </div>

        <span className="inline-flex items-center gap-2 text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-gold">
          <span className="w-8 h-[2px] bg-gold" />
          Stay Connected
          <span className="w-8 h-[2px] bg-gold" />
        </span>
        <h2 className="mt-4 font-display font-bold text-3xl md:text-5xl text-ink uppercase leading-[1.05]">
          Be the first<br className="sm:hidden" /> to know
        </h2>
        <p className="mt-4 text-ink/60 font-body text-sm md:text-base leading-relaxed max-w-md mx-auto">
          Early access to drops, restock alerts and subscriber-only prices.
          No spam — just the good stuff.
        </p>

        {done ? (
          <div className="mt-9 max-w-md mx-auto rounded-2xl bg-panel border border-gold/40 px-6 py-5">
            <p className="font-body font-semibold text-ink">You're on the list.</p>
            <p className="mt-1 text-sm text-ink/60">Watch your inbox — the next drop hits soon.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-9 flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 h-[52px] px-5 rounded-full bg-panel border border-cream-line text-ink placeholder:text-ink/40 text-sm font-body focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="h-[52px] px-8 rounded-full bg-gold text-cream font-body font-bold text-[14px] tracking-wide shadow-card hover:bg-gold-light hover:text-cream-deep transition-all hover:scale-[1.02] whitespace-nowrap"
            >
              Join the List
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
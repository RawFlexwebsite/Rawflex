"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { SITE } from "@/lib/data";
import { submitInquiry } from "@/actions/contact";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // Append phone to message if it exists
    const phoneVal = formData.get('phone') as string;
    const msg = formData.get('message') as string;
    if (phoneVal) {
      formData.set('message', `Phone: ${phoneVal}\n\n${msg}`);
    }

    try {
      const res = await submitInquiry(formData);
      if (res.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error || "Failed to send message.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-12 md:py-16 bg-cream-deep/60">
      <div className="max-w-wrap mx-auto px-5 md:px-8">

        {/* Split Card Layout */}
        <Reveal>
          <div className="bg-panel rounded-[32px] overflow-hidden shadow-soft grid lg:grid-cols-[0.8fr_1.2fr] border border-cream-line">

            {/* Left Panel: Information & Map */}
            <div className="bg-[#0A0C0B] p-8 md:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <div className="relative z-10">
                <h3 className="font-display font-bold text-3xl text-ink uppercase mb-2">Hit Us Up</h3>
                <p className="text-ink/60 text-sm md:text-[15px] mb-10 leading-relaxed max-w-sm">
                  Whether it's a sizing question, a bulk order or a collab — drop us a line, we reply fast.
                </p>

                <div className="space-y-8">
                  <a href={`mailto:${SITE.email}`} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-cream-deep flex items-center justify-center shrink-0 border border-cream-line group-hover:border-gold/40 transition-colors">
                      <svg className="w-5 h-5 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-gold-light/80 font-semibold block mb-1">Email Us</span>
                      <p className="font-display font-medium text-ink text-[15px] group-hover:text-gold-light transition-colors break-all">{SITE.email}</p>
                    </div>
                  </a>

                  <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-cream-deep flex items-center justify-center shrink-0 border border-cream-line group-hover:border-gold/40 transition-colors">
                      <svg className="w-5 h-5 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-gold-light/80 font-semibold block mb-1">WhatsApp / Call</span>
                      <p className="font-display font-medium text-ink text-[15px] group-hover:text-gold-light transition-colors">{SITE.phone}</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="relative z-10 mt-12 pt-10 border-t border-cream-line">
                <span className="text-[11px] uppercase tracking-wider text-gold-light/80 font-semibold block mb-3">Our Studio</span>
                <p className="font-display font-medium text-ink text-[15px] mb-4">{SITE.address}</p>
                <div className="w-full h-32 rounded-xl overflow-hidden border border-cream-line">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114074.45265956238!2d80.2975141665041!3d26.44056801683342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c4770b127c46f%3A0x1778302a9f1997a2!2sKanpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right Panel: Form */}
            <div className="p-8 md:p-12 lg:p-14 bg-panel relative">
              <h3 className="font-display font-bold text-2xl text-ink uppercase mb-8">Send a Message</h3>

              {success ? (
                <div className="bg-emerald/10 border border-emerald/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-emerald rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="font-display font-bold text-xl text-ink mb-2">Message Sent!</h4>
                  <p className="text-ink/60 text-sm">Thank you for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setSuccess(false)} className="mt-6 text-emerald text-sm font-semibold hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-6 p-4 bg-red-950/50 text-red-400 text-sm rounded-xl border border-red-900">
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label htmlFor="first-name" className="text-[13px] font-semibold text-ink/80 mb-1">
                        First Name
                      </label>
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        required
                        className="w-full border-b border-cream-line bg-transparent px-0 py-2.5 text-[15px] text-ink placeholder:text-ink/30 focus:border-emerald focus:outline-none transition-colors"
                        placeholder="Rohit"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="last-name" className="text-[13px] font-semibold text-ink/80 mb-1">
                        Last Name
                      </label>
                      <input
                        id="last-name"
                        name="last-name"
                        type="text"
                        required
                        className="w-full border-b border-cream-line bg-transparent px-0 py-2.5 text-[15px] text-ink placeholder:text-ink/30 focus:border-emerald focus:outline-none transition-colors"
                        placeholder="Sharma"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 mt-6">
                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-[13px] font-semibold text-ink/80 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full border-b border-cream-line bg-transparent px-0 py-2.5 text-[15px] text-ink placeholder:text-ink/30 focus:border-emerald focus:outline-none transition-colors"
                        placeholder="rohit@example.com"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="phone" className="text-[13px] font-semibold text-ink/80 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full border-b border-cream-line bg-transparent px-0 py-2.5 text-[15px] text-ink placeholder:text-ink/30 focus:border-emerald focus:outline-none transition-colors"
                        placeholder="+91 98XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mt-6">
                    <label htmlFor="message" className="text-[13px] font-semibold text-ink/80 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full border-b border-cream-line bg-transparent px-0 py-2.5 text-[15px] text-ink placeholder:text-ink/30 focus:border-emerald focus:outline-none transition-colors resize-none"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-10 w-full md:w-auto inline-flex items-center justify-center px-10 py-4 rounded-full bg-emerald text-cream font-body font-semibold text-[15px] tracking-wide shadow-card hover:bg-emerald-deep transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                  <p className="text-ink/40 text-xs mt-4">
                    Your message will be sent securely to our team.
                  </p>
                </form>
              )}
            </div>

          </div>
        </Reveal>

        {/* FAQs */}
        <div className="mt-20 max-w-3xl mx-auto">
          <Reveal>
            <div className="eyebrow justify-center inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-gold" />
              Support
              <span className="h-px w-6 bg-gold" />
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-ink text-center mb-10">
              Frequently Asked Questions
            </h3>
          </Reveal>

          <Reveal delay={1} className="space-y-4">
            <details className="group bg-panel rounded-2xl border border-cream-line shadow-sm overflow-hidden transition-colors duration-300">
              <summary className="font-display font-semibold text-ink text-[15px] md:text-base px-6 py-5 cursor-pointer flex justify-between items-center outline-none list-none hover:text-emerald transition-colors">
                Do you ship pan-India?
                <span className="w-8 h-8 rounded-full bg-cream-deep flex items-center justify-center transition-transform group-open:rotate-180 group-open:bg-emerald/10 group-open:text-emerald text-ink/50">
                  <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-ink/70 text-sm md:text-[15px] leading-relaxed border-t border-cream-line/50 mx-6 pt-4">
                Yes, we ship across all of India. Delivery typically takes 2-4 business days for metro cities and 5-7 business days for the rest.
              </div>
            </details>

            <details className="group bg-panel rounded-2xl border border-cream-line shadow-sm overflow-hidden transition-colors duration-300">
              <summary className="font-display font-semibold text-ink text-[15px] md:text-base px-6 py-5 cursor-pointer flex justify-between items-center outline-none list-none hover:text-emerald transition-colors">
                What is your return policy?
                <span className="w-8 h-8 rounded-full bg-cream-deep flex items-center justify-center transition-transform group-open:rotate-180 group-open:bg-emerald/10 group-open:text-emerald text-ink/50">
                  <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-ink/70 text-sm md:text-[15px] leading-relaxed border-t border-cream-line/50 mx-6 pt-4">
                We offer a 7-day exchange window for unworn items with all tags intact. Refer to our Refund & Cancellation policy for details.
              </div>
            </details>

            <details className="group bg-panel rounded-2xl border border-cream-line shadow-sm overflow-hidden transition-colors duration-300">
              <summary className="font-display font-semibold text-ink text-[15px] md:text-base px-6 py-5 cursor-pointer flex justify-between items-center outline-none list-none hover:text-emerald transition-colors">
                How do I pick the right size?
                <span className="w-8 h-8 rounded-full bg-cream-deep flex items-center justify-center transition-transform group-open:rotate-180 group-open:bg-emerald/10 group-open:text-emerald text-ink/50">
                  <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-ink/70 text-sm md:text-[15px] leading-relaxed border-t border-cream-line/50 mx-6 pt-4">
                Our oversized fits run true to label. Message us on WhatsApp with your height and weight and we'll recommend the perfect size.
              </div>
            </details>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
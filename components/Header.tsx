"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { navLinks, SITE } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import dbData from "@/lib/db.json";
import { Search, User, ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { getShippingSettings } from "@/actions/admin/shipping";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const isAdmin = user && (user.email === 'admin@rawflex.in' || user.user_metadata?.role === 'admin');
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const router = useRouter();
  const [shipping, setShipping] = useState<any>(null);

  useEffect(() => {
    getShippingSettings()
      .then((data) => setShipping(data))
      .catch((err) => console.error("Error loading header shipping settings:", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentSearch = params.get("search");
    if (currentSearch) setSearchQuery(currentSearch);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
      setShowMobileSearch(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkUserSession = () => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; rawflex-user-session=`)
      if (parts.length === 2) {
        const val = parts.pop()?.split(';').shift()
        if (val) {
          try {
            const session = JSON.parse(decodeURIComponent(val))
            setUser({ id: session.id, email: session.email, user_metadata: { role: session.role, full_name: session.full_name } })
            return
          } catch (e) {}
        }
      }

      const mockAdmin = document.cookie.includes('mock-admin-logged-in=true')
      if (mockAdmin) {
        setUser({ id: 'mock-admin-id', email: 'admin@rawflex.in', user_metadata: { role: 'admin' } })
        return
      }

      setUser(null)
    }

    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
        }
      }).catch(() => { });
    }

    window.addEventListener('rawflex-login-status-change', checkUserSession)
    return () => {
      window.removeEventListener('rawflex-login-status-change', checkUserSession)
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={`fixed top-9 inset-x-0 z-[99999] border-b border-[#D4A82C] transition-all duration-300 ${open
            ? "bg-[#080909]"
            : scrolled
              ? "bg-cream/90 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)]"
              : "bg-transparent"
          }`}
      >
        <div className="relative max-w-wrap mx-auto px-4 md:px-7 flex items-center justify-between h-[64px] md:h-[74px]">
          {/* Mobile logo — absolutely centered in navbar on mobile only */}
          <a
            href="/"
            className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center shrink-0 overflow-hidden"
            aria-label="RAWFLEX Home"
          >
            <Image
              src="/rawflex_logo.png"
              alt="RAWFLEX Logo"
              width={72}
              height={72}
              className="object-contain w-[64px] h-[64px]"
              priority
            />
          </a>

          {/* Mobile hamburger — left side on mobile only */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setOpen((v) => !v);
              setShowMobileSearch(false);
            }}
            className={`lg:hidden relative h-9 w-9 flex items-center justify-center text-ink shrink-0 transition-all ${scrolled
                ? "bg-transparent border-transparent shadow-none"
                : "bg-white/10 border border-cream-line/60 rounded-full shadow-sm hover:bg-cream-deep"
              }`}
          >
            <span className="sr-only">Menu</span>
            {open ? (
              <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

<a href="/" className="hidden lg:flex items-center gap-2 shrink-0 overflow-hidden" aria-label="RAWFLEX Home" style={{ height: '100%' }}>
            <Image
              src="/rawflex_logo.png"
              alt="RAWFLEX Logo"
              width={96}
              height={96}
              className="object-contain md:w-[80px] md:h-[80px] lg:w-[96px] lg:h-[96px]"
              priority
            />
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              if (link.label === "Collections") {
                return (
                  <div key={link.href} className="relative group py-2">
                    <a
                      href={link.href}
                      className="font-body text-[12px] font-bold uppercase tracking-wider text-ink hover:text-gold transition-colors flex items-center gap-1"
                    >
                      {link.label}
                      <svg className="w-3.5 h-3.5 text-ink/40 group-hover:text-gold transition-transform group-hover:rotate-180 duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[540px] bg-panel border border-cream-line rounded-2xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 p-6 z-50">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                          <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-wider text-ink/40">Categories</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {dbData.categories.map((cat: any) => (
                              <a
                                key={cat.id}
                                href={`/shop?category=${cat.id}`}
                                className="block px-3 py-2 rounded-lg text-sm font-semibold text-ink/75 hover:bg-cream hover:text-emerald transition-colors"
                              >
                                {cat.name}
                              </a>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-wider text-ink/40">Discover</p>
                          <div className="space-y-2">
                            <a
                              href="/shop"
                              className="block p-3 rounded-xl bg-cream/60 hover:bg-cream transition-colors"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gold">New</span>
                              <p className="font-display font-semibold text-ink text-sm mt-0.5">New Arrivals</p>
                            </a>
                            <a
                              href="/shop?featured=true"
                              className="block p-3 rounded-xl bg-cream/60 hover:bg-cream transition-colors"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Curated</span>
                              <p className="font-display font-semibold text-ink text-sm mt-0.5">Featured Pieces</p>
                            </a>
                          </div>
                        </div>
                      </div>

                      <a
                        href="/shop"
                        className="mt-5 block text-center px-4 py-2.5 rounded-xl bg-emerald text-cream text-sm font-bold hover:bg-emerald-deep transition-colors"
                      >
                        Shop All
                      </a>
                    </div>
                  </div>
                )
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-[12px] font-bold uppercase tracking-wider text-ink hover:text-gold transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1.5 h-[1.5px] w-0 bg-gold group-hover:w-full transition-all duration-300" />
                </a>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowDesktopSearch((v) => !v)}
                aria-label="Search"
                title="Search"
                className="text-ink hover:text-gold transition-colors"
              >
                <Search className="w-[19px] h-[19px]" />
              </button>
              {showDesktopSearch && (
                <form
                  onSubmit={(e) => {
                    handleSearch(e);
                    setShowDesktopSearch(false);
                  }}
                  className="absolute right-0 top-full mt-4 w-64 z-50"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-cream-deep border border-cream-line rounded-full py-2.5 pl-4 pr-10 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-gold transition-all shadow-card"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-gold transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-5 shrink-0">
                {isAdmin && (
                  <a
                    href="/admin"
                    title="Admin Dashboard"
                    className="text-ink hover:text-gold transition-colors"
                  >
                    <LayoutDashboard className="w-[19px] h-[19px]" />
                  </a>
                )}
                <a
                  href="/profile"
                  title="Manage Profile"
                  className="text-ink hover:text-gold transition-colors"
                >
                  <User className="w-[19px] h-[19px]" />
                </a>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    localStorage.removeItem('rawflex-customer-profile');
                    setUser(null);
                    window.location.reload();
                  }}
                  title="Logout"
                  className="text-ink hover:text-gold transition-colors"
                >
                  <LogOut className="w-[19px] h-[19px]" />
                </button>
              </div>
            ) : (
              <a href="/login" title="Login / Register" className="text-ink hover:text-gold transition-colors">
                <User className="w-[19px] h-[19px]" />
              </a>
            )}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping Cart"
              title="Shopping Cart"
              className="relative text-ink hover:text-gold transition-colors shrink-0"
            >
              <ShoppingBag className="w-[19px] h-[19px]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-cream text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm animate-scale-up">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile search & cart — right side on mobile only */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => {
                setShowMobileSearch((v) => !v);
                setOpen(false);
              }}
              className={`relative h-9 w-9 flex items-center justify-center rounded-full text-ink hover:text-emerald hover:scale-105 transition-all shrink-0 ${
                showMobileSearch ? "bg-emerald text-cream" : scrolled ? "bg-transparent" : "bg-white/10 border border-cream-line/60 shadow-sm"
              }`}
              title="Search Products"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative h-9 w-9 flex items-center justify-center rounded-full bg-gold text-white shadow-md hover:bg-emerald transition-all shrink-0"
              title="Shopping Cart"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald text-cream text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {showMobileSearch && (
          <div className="lg:hidden bg-cream-deep border-t border-cream-line px-5 py-3 shadow-md animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-panel border border-cream-line rounded-full py-2.5 pl-4 pr-10 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-emerald transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

{/* Mobile menu panel */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[100px] bottom-0 bg-[#080909] z-[9999] overflow-y-auto transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${open ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
            }`}
        >
          <nav className="flex flex-col px-6 pt-8 gap-1">
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-panel border border-cream-line rounded-full py-2.5 pl-4 pr-10 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-gold transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {navLinks.map((link, i) => {
              if (link.label === "Collections") {
                return (
                  <div key={link.href} className="border-b border-cream-line py-3.5">
                    <button
                      onClick={() => setMobileCollectionOpen(!mobileCollectionOpen)}
                      className="w-full flex items-center justify-between font-display text-2xl font-semibold text-ink text-left"
                    >
                      <span>{link.label}</span>
                      <svg className={`w-6 h-6 text-gold transition-transform duration-200 ${mobileCollectionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {mobileCollectionOpen && (
                      <div className="pl-4 mt-3 space-y-4 animate-fade-in flex flex-col">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {dbData.categories.map((cat: any) => (
                            <a
                              key={cat.id}
                              href={`/shop?category=${cat.id}`}
                              onClick={() => setOpen(false)}
                              className="text-base font-semibold text-ink/75 hover:text-emerald"
                            >
                              {cat.name}
                            </a>
                          ))}
                        </div>
                        <div className="flex flex-col gap-3 pt-3 border-t border-cream-line/60">
                          <a
                            href="/shop"
                            onClick={() => setOpen(false)}
                            className="text-lg font-semibold text-ink/85 hover:text-emerald"
                          >
                            New Arrivals
                          </a>
                          <a
                            href="/shop?featured=true"
                            onClick={() => setOpen(false)}
                            className="text-lg font-semibold text-ink/85 hover:text-emerald"
                          >
                            Featured Pieces
                          </a>
                          <a
                            href="/shop"
                            onClick={() => setOpen(false)}
                            className="text-lg font-bold text-emerald"
                          >
                            Shop All
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl font-semibold text-ink py-3.5 border-b border-cream-line"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {link.label}
                </a>
              )
            })}
            {user && (
              <>
                {isAdmin && (
                  <a
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl font-semibold text-gold py-3.5 border-b border-cream-line flex items-center justify-between"
                  >
                    <span>Admin Dashboard</span>
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="9" rx="1" />
                      <rect x="14" y="3" width="7" height="5" rx="1" />
                      <rect x="14" y="12" width="7" height="9" rx="1" />
                      <rect x="3" y="16" width="7" height="5" rx="1" />
                    </svg>
                  </a>
                )}
                <a
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl font-semibold text-gold py-3.5 border-b border-cream-line flex items-center justify-between"
                >
                  <span>Manage Profile</span>
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </a>
              </>
            )}
            {user ? (
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  localStorage.removeItem('rawflex-customer-profile');
                  setUser(null);
                  setOpen(false);
                  window.location.reload();
                }}
                className="mt-7 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-emerald text-cream font-body font-semibold text-base shadow-card"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-7 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-emerald text-cream font-body font-semibold text-base shadow-card"
              >
                Login/Register
              </a>
            )}
            <div className="mt-8 text-sm text-ink/60 font-body">
              <p>{SITE.phone}</p>
              <p className="mt-1">{SITE.email}</p>
            </div>
          </nav>
        </div>
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} shipping={shipping} />
    </>
  );
}

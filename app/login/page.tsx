import Image from 'next/image'
import { BadgePercent, Boxes, ShieldCheck, Truck } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthForm from './_components/AuthForm'

export const metadata = {
  title: 'Login | RAWFLEX',
  description: 'Login securely with email OTP or Google to access your RAWFLEX account.',
}

const memberBenefits = [
  {
    icon: ShieldCheck,
    label: 'Secure OTP access',
    copy: 'Passwordless sign-in built for repeat shoppers.',
  },
  {
    icon: Boxes,
    label: 'Drop access',
    copy: 'Get back to limited releases and saved account details faster.',
  },
  {
    icon: Truck,
    label: 'Order visibility',
    copy: 'Track orders, addresses, and updates from one member profile.',
  },
]

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const { redirect, error } = await searchParams

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#080909] pt-[100px] md:pt-[110px]">
        <div className="relative min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-110px)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(199,183,158,0.18),transparent_28%),linear-gradient(135deg,#15130e_0%,#080909_42%,#0b0d0c_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(242,239,234,1) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,234,1) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />

          <div className="relative mx-auto grid min-h-[calc(100vh-100px)] w-full max-w-wrap grid-cols-1 items-stretch px-4 py-8 md:min-h-[calc(100vh-110px)] md:px-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-12 xl:gap-16">
            <section className="relative hidden min-h-[620px] overflow-hidden rounded-[28px] border border-gold/15 bg-panel shadow-[0_30px_100px_-45px_rgba(0,0,0,1)] lg:block">
              <Image
                src="/OVERSIZED_person.png"
                alt="RAWFLEX oversized black tee editorial"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover object-[12%_50%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,9,0.9)_0%,rgba(8,9,9,0.58)_36%,rgba(8,9,9,0.12)_72%,rgba(8,9,9,0.04)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#080909] via-[#080909]/72 to-transparent" />

              <div className="relative z-10 flex h-full max-w-[520px] flex-col justify-between px-10 py-10 xl:px-14 xl:py-12">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-[#080909]/45 px-3 py-2 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-gold/80">
                    Member Portal
                  </span>
                </div>

                <div>
                  <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold/80">
                    <BadgePercent className="h-4 w-4" />
                    RAWFLEX private access
                  </p>
                  <h2 className="font-display text-5xl font-extrabold leading-[0.98] text-ink xl:text-6xl">
                    Your drop,
                    <span className="block gradient-gold-text">your lane.</span>
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-7 text-ink/62">
                    Sign in to manage orders, keep addresses ready, and move faster when the next limited piece goes live.
                  </p>
                </div>

                <div className="grid max-w-2xl grid-cols-3 gap-3">
                  {memberBenefits.map(({ icon: Icon, label, copy }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-[#080909]/58 p-4 backdrop-blur-md">
                      <Icon className="mb-4 h-5 w-5 text-gold" />
                      <p className="text-sm font-bold text-ink">{label}</p>
                      <p className="mt-2 text-xs leading-5 text-ink/45">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex items-center justify-center py-2 lg:py-0">
              <div className="w-full max-w-[460px]">
                <div className="mb-6 text-center lg:hidden">
                  <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-gold/75">
                      Member Portal
                    </span>
                  </div>
                  <h1 className="font-display text-4xl font-extrabold leading-none text-ink">
                    Welcome to RAWFLEX
                  </h1>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ink/52">
                    Secure access for orders, drops, and member perks.
                  </p>
                </div>

                <div className="relative rounded-[28px] border border-white/10 bg-[#101211]/90 shadow-[0_36px_100px_-46px_rgba(0,0,0,1)] backdrop-blur-xl animate-fade-in-up">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
                  <div className="p-5 sm:p-7 lg:p-8">
                    <div className="mb-7 hidden lg:block">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold/70">
                        Secure sign in
                      </p>
                      <h1 className="mt-3 font-display text-3xl font-extrabold leading-none text-ink">
                        Welcome back
                      </h1>
                      <p className="mt-2 text-sm text-ink/45">
                        Continue with email, phone OTP, or Google.
                      </p>
                    </div>

                    <AuthForm redirectTo={redirect} initialError={error} />
                  </div>
                </div>

                <p className="mx-auto mt-5 max-w-sm text-center text-[11px] leading-5 text-ink/30">
                  By continuing you agree to RAWFLEX&apos;s{' '}
                  <a href="/policies/terms" className="underline underline-offset-2 transition-colors hover:text-gold/80">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="/policies/privacy" className="underline underline-offset-2 transition-colors hover:text-gold/80">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

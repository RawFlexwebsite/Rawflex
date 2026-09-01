'use client'

import React, { useEffect, useRef, useState, useTransition } from 'react'
import { sendEmailOtp, verifyEmailOtp, verifyPhoneOtp } from '@/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { getFirebaseAuth, isFirebaseClientConfigured } from '@/lib/firebase/client'
import { isFirebaseAuthEmulatorEnabled } from '@/lib/firebase/emulator'
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  User,
} from 'lucide-react'

type AuthMode = 'LOGIN' | 'REGISTER'
type OtpChannel = 'EMAIL' | 'PHONE'

type ParsedIdentifier =
  | { channel: 'EMAIL'; email: string }
  | { channel: 'PHONE'; phone: string; localPhone: string }

const recaptchaContainerId = 'rawflex-phone-recaptcha'

const fieldClassName =
  'h-12 w-full rounded-2xl border border-white/10 bg-[#080909] pl-11 pr-4 text-sm font-semibold text-ink outline-none transition-all duration-200 placeholder:text-ink/25 focus:border-gold/70 focus:bg-[#0b0d0c] focus:ring-2 focus:ring-gold/15'

const primaryButtonClassName =
  'flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gold/70 bg-gradient-to-r from-[#f0e9dc] to-[#c7b79e] px-4 text-sm font-extrabold text-[#080909] shadow-[0_18px_44px_-26px_rgba(240,233,220,0.95)] transition-all duration-200 hover:border-gold-light hover:from-white hover:to-gold-light hover:shadow-[0_22px_54px_-28px_rgba(240,233,220,1)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none'

const secondaryButtonClassName =
  'flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-[#080909] px-4 text-sm font-extrabold text-ink transition-all duration-200 hover:border-gold/55 hover:bg-[#111311] hover:text-gold disabled:cursor-not-allowed disabled:opacity-65'

function getSafeRedirectPath(redirectTo: string | undefined): string {
  if (!redirectTo || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return '/'
  }

  return redirectTo
}

function parseIdentifier(value: string): ParsedIdentifier | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (trimmed.includes('@')) {
    return { channel: 'EMAIL', email: trimmed.toLowerCase() }
  }

  const digits = trimmed.replace(/\D/g, '')
  if (digits.length === 10) {
    return { channel: 'PHONE', phone: `+91${digits}`, localPhone: digits }
  }

  if (trimmed.startsWith('+') && digits.length >= 11 && digits.length <= 15) {
    return { channel: 'PHONE', phone: `+${digits}`, localPhone: digits.slice(-10) }
  }

  return null
}

function getIdentifierLabel(channel: OtpChannel | null): string {
  if (channel === 'PHONE') {
    return 'phone number'
  }

  if (channel === 'EMAIL') {
    return 'email address'
  }

  return 'email address or phone number'
}

function getMaskedIdentifier(parsed: ParsedIdentifier): string {
  if (parsed.channel === 'PHONE') {
    return '+91 XXXXXXXXXX'
  }

  return parsed.email
}

function getFirebasePhoneErrorMessage(error: any, isPhoneEmulatorEnabled: boolean): string {
  if (error?.code === 'auth/network-request-failed' && isPhoneEmulatorEnabled) {
    return 'Firebase Auth Emulator is enabled, but the emulator is not reachable. Turn it off for real SMS OTP.'
  }

  if (error?.code === 'auth/billing-not-enabled') {
    return 'Firebase is blocking SMS because billing is not active for this Firebase project. Confirm the same project is upgraded to Blaze and has an active Cloud Billing account.'
  }

  if (error?.code === 'auth/operation-not-allowed') {
    return 'Phone sign-in is not enabled for this Firebase project. Enable the Phone provider in Firebase Authentication.'
  }

  if (error?.code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized in Firebase Authentication. Add it under Authentication → Settings → Authorized domains.'
  }

  if (error?.code === 'auth/too-many-requests') {
    return 'Firebase has temporarily blocked OTP requests from this device or phone number. Try again later or use a Firebase test phone number.'
  }

  if (error?.code === 'auth/invalid-app-credential' || error?.code === 'auth/captcha-check-failed') {
    return 'reCAPTCHA verification failed. Make sure this domain is added to Firebase Authorized Domains and the reCAPTCHA Enterprise site key. Then refresh and try again.'
  }

  return error?.message || 'Failed to send phone OTP. Please try again.'
}

export default function AuthForm({
  redirectTo,
  initialError,
}: {
  redirectTo?: string
  initialError?: string
}) {
  const [mode, setMode] = useState<AuthMode>('LOGIN')
  const [otpSent, setOtpSent] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [activeIdentifier, setActiveIdentifier] = useState<ParsedIdentifier | null>(null)
  const [otpFullName, setOtpFullName] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState(initialError || '')
  const [success, setSuccess] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null)

  const parsedIdentifier = parseIdentifier(identifier)
  const selectedChannel = parsedIdentifier?.channel || null
  const isPhoneEmulatorEnabled = isFirebaseAuthEmulatorEnabled()

  useEffect(() => {
    if (resendTimer <= 0) {
      return
    }

    const interval = window.setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [resendTimer])

  useEffect(() => {
    return () => {
      clearRecaptchaVerifier()
    }
  }, [])

  const clearRecaptchaVerifier = () => {
    try {
      recaptchaVerifier.current?.clear()
    } catch (_) {
      // ignore errors during cleanup — the widget may already be gone
    }
    recaptchaVerifier.current = null
    document.getElementById(`${recaptchaContainerId}-inner`)?.remove()
  }

  // Builds a brand-new RecaptchaVerifier every time, waits for the widget
  // to fully render, then returns it. Always call clearRecaptchaVerifier()
  // before this to avoid stale widget references.
  const buildRecaptchaVerifier = async (): Promise<RecaptchaVerifier> => {
    const host = document.getElementById(recaptchaContainerId)
    if (!host) throw new Error('reCAPTCHA host element not found.')

    // Mount a fresh inner div so the previous iframe is completely gone
    document.getElementById(`${recaptchaContainerId}-inner`)?.remove()
    const inner = document.createElement('div')
    inner.id = `${recaptchaContainerId}-inner`
    host.appendChild(inner)

    const auth = getFirebaseAuth()
    auth.languageCode = 'en'

    const verifier = new RecaptchaVerifier(auth, inner.id, { size: 'invisible' })
    recaptchaVerifier.current = verifier

    // Explicitly render and wait — prevents the "null style" crash that
    // occurs when signInWithPhoneNumber tries to use an un-rendered widget
    await verifier.render()

    return verifier
  }

  const requestEmailOtp = (parsed: Extract<ParsedIdentifier, { channel: 'EMAIL' }>) => {
    startTransition(async () => {
      const res = await sendEmailOtp(parsed.email, mode, otpFullName.trim())
      if (res?.error) {
        setError(res.error)
        return
      }

      setActiveIdentifier(parsed)
      setOtpSent(true)
      setResendTimer(60)
      setSuccess(`A 6-digit verification code has been sent to ${parsed.email}`)
    })
  }

  const requestPhoneOtp = (parsed: Extract<ParsedIdentifier, { channel: 'PHONE' }>) => {
    if (!isFirebaseClientConfigured()) {
      setError('Phone OTP is not configured yet. Add the Firebase web app environment variables first.')
      return
    }

    startTransition(async () => {
      try {
        const auth = getFirebaseAuth()

        // Always tear down the previous verifier before building a new one
        // so there are no stale widget references
        clearRecaptchaVerifier()
        const verifier = await buildRecaptchaVerifier()

        const confirmation = await signInWithPhoneNumber(auth, parsed.phone, verifier)

        setConfirmationResult(confirmation)
        setActiveIdentifier(parsed)
        setOtpSent(true)
        setResendTimer(60)
        setSuccess(`A 6-digit verification code has been sent to ${getMaskedIdentifier(parsed)}`)
      } catch (phoneError: any) {
        console.error('Firebase phone OTP send failed:', {
          code: phoneError?.code,
          message: phoneError?.message,
          name: phoneError?.name,
          stack: phoneError?.stack,
        })
        clearRecaptchaVerifier()
        setError(getFirebasePhoneErrorMessage(phoneError, isPhoneEmulatorEnabled))
      }
    })
  }

  const requestOtp = () => {
    const parsed = parseIdentifier(identifier)

    setError('')
    setSuccess('')
    setOtpCode('')

    if (!parsed) {
      setError('Enter a valid email address or Indian phone number.')
      return
    }

    if (mode === 'REGISTER' && !otpFullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (parsed.channel === 'EMAIL') {
      requestEmailOtp(parsed)
      return
    }

    requestPhoneOtp(parsed)
  }

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    requestOtp()
  }

  const handleGoogleSignIn = () => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      const supabase = createClient()
      const nextPath = getSafeRedirectPath(redirectTo)
      const callbackUrl = new URL('/api/auth/callback', window.location.origin)
      callbackUrl.searchParams.set('next', nextPath)

      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            prompt: 'select_account',
          },
        },
      })

      if (googleError) {
        setError(googleError.message)
      }
    })
  }

  const verifyPhoneCode = (parsed: Extract<ParsedIdentifier, { channel: 'PHONE' }>) => {
    if (!confirmationResult) {
      setError('Please request a new phone OTP.')
      return
    }

    startTransition(async () => {
      try {
        const credential = await confirmationResult.confirm(otpCode)
        const firebaseIdToken = await credential.user.getIdToken()
        const res = await verifyPhoneOtp(firebaseIdToken, mode, redirectTo, otpFullName.trim())

        if (res?.error) {
          setConfirmationResult(null)
          setOtpSent(false)
          setOtpCode('')
          setError(`${res.error} Please request a fresh phone OTP.`)
          return
        }

        setSuccess(`Phone number ${getMaskedIdentifier(parsed)} verified.`)
      } catch (phoneError: any) {
        console.error('Firebase phone OTP verification failed:', phoneError)
        if (phoneError?.code === 'auth/invalid-verification-id') {
          setConfirmationResult(null)
          setOtpSent(false)
          setOtpCode('')
          setError('This phone OTP session is no longer valid. Please request a fresh code.')
          return
        }

        setError(phoneError?.message || 'Invalid phone OTP code.')
      }
    })
  }

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code.')
      return
    }

    if (!activeIdentifier) {
      setError('Please request a new OTP.')
      return
    }

    if (activeIdentifier.channel === 'PHONE') {
      verifyPhoneCode(activeIdentifier)
      return
    }

    startTransition(async () => {
      const res = await verifyEmailOtp(activeIdentifier.email, otpCode, redirectTo, otpFullName.trim())
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setOtpSent(false)
    setOtpCode('')
    setActiveIdentifier(null)
    setConfirmationResult(null)
    setError('')
    setSuccess('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div id={recaptchaContainerId} className="sr-only" />

      <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-[#080909] p-1">
        {(['LOGIN', 'REGISTER'] as AuthMode[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => switchMode(option)}
            className={`h-10 rounded-xl text-xs font-extrabold uppercase tracking-[0.16em] transition-all duration-200 ${
              mode === option
                ? 'bg-ink text-[#080909] shadow-[0_14px_34px_-22px_rgba(242,239,234,0.9)]'
                : 'text-ink/42 hover:text-gold'
            }`}
          >
            {option === 'LOGIN' ? 'Login' : 'Register'}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose/25 bg-rose/10 p-4 text-sm text-rose-soft animate-slide-in">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
          <div>
            <p className="font-extrabold text-ink">Unable to continue</p>
            <p className="mt-1 leading-5 text-rose-soft/90">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#a9cdb1]/25 bg-[#a9cdb1]/10 p-4 text-sm text-[#b7d8bf] animate-slide-in">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#a9cdb1]" />
          <div>
            <p className="font-extrabold text-ink">Code sent</p>
            <p className="mt-1 leading-5 text-[#b7d8bf]/90">{success}</p>
          </div>
        </div>
      )}

      {isPhoneEmulatorEnabled && (
        <div className="rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm font-semibold leading-5 text-gold-light">
          Firebase Auth Emulator is active. Phone OTP codes will appear in the emulator terminal instead of being sent by SMS.
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === 'REGISTER' && (
            <div>
              <label htmlFor="otp_name" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink/48">
                Full name
              </label>
              <div className="group relative">
                <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30 transition-colors group-focus-within:text-gold" />
                <input
                  id="otp_name"
                  type="text"
                  required
                  autoComplete="name"
                  value={otpFullName}
                  onChange={(e) => setOtpFullName(e.target.value)}
                  className={fieldClassName}
                  placeholder="Ayesha Khan"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="otp_identifier" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink/48">
              Email address / phone number
            </label>
            <div className="group relative">
              {selectedChannel === 'PHONE' ? (
                <Phone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30 transition-colors group-focus-within:text-gold" />
              ) : (
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30 transition-colors group-focus-within:text-gold" />
              )}
              <input
                id="otp_identifier"
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={fieldClassName}
                placeholder="you@example.com or +91 XXXXXXXXXX"
              />
            </div>
            <p className="mt-2 text-xs leading-5 text-ink/34">
              Phone OTP uses Firebase verification. Indian 10-digit numbers are sent as +91.
            </p>
          </div>

          <button type="submit" disabled={pending} className={`${primaryButtonClassName} mt-2`}>
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="whitespace-nowrap">
                  {mode === 'LOGIN' ? 'Send login OTP' : 'Create account with OTP'}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </>
            )}
          </button>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/30">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={pending}
              className={secondaryButtonClassName}
            >
              {pending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Continue with Google</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="otp_code" className="block text-xs font-bold uppercase tracking-[0.14em] text-ink/48">
                Verification code
              </label>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setOtpCode('')
                  setActiveIdentifier(null)
                  setConfirmationResult(null)
                  setError('')
                  setSuccess('')
                }}
                className="text-xs font-bold text-gold/85 transition-colors hover:text-gold-light"
              >
                Change {getIdentifierLabel(activeIdentifier?.channel || null)}
              </button>
            </div>
            <div className="group relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30 transition-colors group-focus-within:text-gold" />
              <input
                id="otp_code"
                type="text"
                inputMode="numeric"
                required
                maxLength={6}
                autoComplete="one-time-code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className={`${fieldClassName} text-center text-lg tracking-[0.38em]`}
                placeholder="123456"
              />
            </div>
          </div>

          <button type="submit" disabled={pending} className={`${primaryButtonClassName} mt-2`}>
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="whitespace-nowrap">
                  Verify and {mode === 'LOGIN' ? 'login' : 'create account'}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={requestOtp}
            disabled={pending || resendTimer > 0}
            className="mx-auto block text-xs font-bold text-ink/45 underline underline-offset-4 transition-colors hover:text-gold disabled:cursor-not-allowed disabled:text-ink/25 disabled:no-underline"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
          </button>
        </form>
      )}
    </div>
  )
}

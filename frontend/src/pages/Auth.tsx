import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Loader2,
  Sparkles,
} from "lucide-react"

import { authApi } from "../api/client"
import { useStore } from "../app/store"

export default function Auth() {
  const navigate = useNavigate()
  const { setUser } = useStore()

  // Track active mode: false = Sign In, true = Create Account
  const [isRegister, setIsRegister] = useState(false)

  // Independent state for each form so switching tabs preserves user input
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Touch gesture support for mobile horizontal swipe
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 45

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && !isRegister) {
      // Swiped left from Sign In -> transition to Create Account
      setIsRegister(true)
      setError(null)
    }
    if (isRightSwipe && isRegister) {
      // Swiped right from Create Account -> transition to Sign In
      setIsRegister(false)
      setError(null)
    }
  }

  const handleSignInSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await authApi.login({
        email: signInEmail,
        password: signInPassword,
      })

      setUser({
        _id: result._id,
        name: result.name,
        email: result.email,
        token: result.token,
      })

      navigate("/")
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please verify credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await authApi.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      })

      setUser({
        _id: result._id,
        name: result.name,
        email: result.email,
        token: result.token,
      })

      navigate("/")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-dvh bg-[#FAF9F6] text-[#121418] lg:grid-cols-[44%_56%]">
      {/* Editorial Left Branding Hero */}
      <section className="relative flex flex-col justify-between bg-[#121418] p-8 sm:p-12 lg:p-16 text-white overflow-hidden">
        {/* Warm glow accent */}
        <div className="absolute top-0 right-0 size-[420px] bg-[#C2410C]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 size-[320px] bg-[#1F4FC7]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Rowad Store Home"
            className="font-display text-[26px] font-extrabold text-white tracking-tight flex items-center cursor-pointer"
          >
            <span>rowad</span>
            <span className="text-[#1F4FC7]">store</span>
            <span className="text-[#C2410C]" aria-hidden="true">.</span>
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-sans-ui font-medium text-[#A0A4AD] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Storefront</span>
          </Link>
        </div>

        <div className="relative z-10 my-16 max-w-[480px]">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-sans-ui font-bold uppercase tracking-wider text-[#C2410C] backdrop-blur-xs">
            <Sparkles className="size-3" aria-hidden="true" />
            <span>{isRegister ? "Exclusive Registration" : "Member Sign In"}</span>
          </div>

          <h1 className="mt-4 font-display text-[38px] sm:text-[46px] font-extrabold leading-[1.12] text-white">
            Daily objects, <br />
            <span className="font-editorial italic font-normal text-[#E8E2D5]">
              curated for purpose.
            </span>
          </h1>

          <p className="mt-5 font-sans-ui text-[15px] leading-relaxed text-[#A0A4AD]">
            Join the Rowad community to track personal orders, manage verified addresses, and access limited seasonal catalog drops.
          </p>

          <div className="mt-10 space-y-3 border-t border-[#2A2C30] pt-8 text-[13px] font-sans-ui text-[#D6D1C2]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-[#C2410C] shrink-0" aria-hidden="true" />
              <span>Direct fulfillment from certified regional artisans</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-[#C2410C] shrink-0" aria-hidden="true" />
              <span>Instant order tracking & expedited Cairo delivery</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] font-sans-ui text-[#6B707B]">
          <span>© 2026 Rowad Platform.</span>
          <span className="hidden sm:inline">Encrypted Auth Microservice (:5001)</span>
        </div>
      </section>

      {/* Form Right Container with Horizontal Swiping Panels */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 overflow-hidden">
        <div className="mx-auto w-full max-w-[480px]">
          {/* Tactile Sliding Pill Switcher */}
          <div
            role="tablist"
            aria-label="Authentication modes"
            className="relative mb-8 grid grid-cols-2 rounded-full border border-[#E8E5DC] bg-[#F4F2EC] p-1 text-[13px] font-sans-ui font-semibold shadow-inner"
          >
            {/* Sliding background pill */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white shadow-xs transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isRegister ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
              }`}
              aria-hidden="true"
            />
            <button
              type="button"
              role="tab"
              aria-selected={!isRegister}
              onClick={() => {
                setIsRegister(false)
                setError(null)
              }}
              className={`relative z-10 flex min-h-[42px] items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
                !isRegister
                  ? "text-[#121418] font-bold"
                  : "text-[#6B707B] hover:text-[#121418]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegister}
              onClick={() => {
                setIsRegister(true)
                setError(null)
              }}
              className={`relative z-10 flex min-h-[42px] items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
                isRegister
                  ? "text-[#121418] font-bold"
                  : "text-[#6B707B] hover:text-[#121418]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-[16px] border border-red-200 bg-red-50 p-4 text-[13px] font-sans-ui text-red-800 shadow-2xs"
            >
              {error}
            </div>
          )}

          {/* Swipeable Dual-Track Container */}
          <div
            className="relative overflow-hidden cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={`flex w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isRegister ? "-translate-x-1/2" : "translate-x-0"
              }`}
            >
              {/* ======================================================== */}
              {/* PANEL 1: SIGN IN (Active when isRegister is false)        */}
              {/* ======================================================== */}
              <div
                className="w-1/2 pr-3 sm:pr-6"
                aria-hidden={isRegister}
              >
                <div>
                  <h2 className="font-display text-[30px] font-extrabold text-[#121418]">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-[14px] font-sans-ui text-[#4A4D55]">
                    Enter your email to sign in to your verified shopper profile.
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} className="mt-7 space-y-4">
                  <div>
                    <label
                      htmlFor="signin-email"
                      className="block text-[12px] font-sans-ui font-bold text-[#121418] uppercase tracking-wider"
                    >
                      Email Address
                    </label>
                    <div className="relative mt-2">
                      <Mail
                        className="absolute top-3.5 left-4 size-4 text-[#6B707B]"
                        aria-hidden="true"
                      />
                      <input
                        id="signin-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        tabIndex={isRegister ? -1 : 0}
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="karim@example.com"
                        className="h-[48px] w-full rounded-[14px] border border-[#E8E5DC] bg-white pl-11 pr-4 font-sans-ui text-[16px] sm:text-[14px] text-[#121418] outline-none transition focus:border-[#1F4FC7] focus:ring-2 focus:ring-[#1F4FC7]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="signin-password"
                        className="block text-[12px] font-sans-ui font-bold text-[#121418] uppercase tracking-wider"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative mt-2">
                      <Lock
                        className="absolute top-3.5 left-4 size-4 text-[#6B707B]"
                        aria-hidden="true"
                      />
                      <input
                        id="signin-password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        tabIndex={isRegister ? -1 : 0}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-[48px] w-full rounded-[14px] border border-[#E8E5DC] bg-white pl-11 pr-4 font-sans-ui text-[16px] sm:text-[14px] text-[#121418] outline-none transition focus:border-[#1F4FC7] focus:ring-2 focus:ring-[#1F4FC7]/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    tabIndex={isRegister ? -1 : 0}
                    aria-busy={loading}
                    className="btn-tactile mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#121418] font-sans-ui text-[14px] font-bold text-white shadow-xs hover:bg-[#1F4FC7] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                {/* Swipe Left Prompt & Trigger */}
                <div className="mt-8 rounded-[18px] border border-[#E8E5DC] bg-[#FFFFFF] p-4 text-center">
                  <p className="text-[13px] font-sans-ui text-[#4A4D55]">
                    Don't have an account yet?
                  </p>
                  <button
                    type="button"
                    tabIndex={isRegister ? -1 : 0}
                    onClick={() => {
                      setIsRegister(true)
                      setError(null)
                    }}
                    className="group mt-2 inline-flex items-center gap-2 font-sans-ui text-[14px] font-bold text-[#1F4FC7] hover:text-[#163CA0] cursor-pointer"
                  >
                    <span>Create an account</span>
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                  <div className="mt-2 text-[11px] font-sans-ui text-[#6B707B]">
                    <span>Swipe left ⟵ or click above</span>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* PANEL 2: CREATE ACCOUNT (Active when isRegister is true)  */}
              {/* ======================================================== */}
              <div
                className="w-1/2 pl-3 sm:pl-6"
                aria-hidden={!isRegister}
              >
                <div>
                  <h2 className="font-display text-[30px] font-extrabold text-[#121418]">
                    Create an account
                  </h2>
                  <p className="mt-2 text-[14px] font-sans-ui text-[#4A4D55]">
                    Join Rowad to manage orders and access tailored collections.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="mt-7 space-y-4">
                  <div>
                    <label
                      htmlFor="register-name"
                      className="block text-[12px] font-sans-ui font-bold text-[#121418] uppercase tracking-wider"
                    >
                      Full Name
                    </label>
                    <div className="relative mt-2">
                      <UserIcon
                        className="absolute top-3.5 left-4 size-4 text-[#6B707B]"
                        aria-hidden="true"
                      />
                      <input
                        id="register-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        tabIndex={!isRegister ? -1 : 0}
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Karim Mostafa"
                        className="h-[48px] w-full rounded-[14px] border border-[#E8E5DC] bg-white pl-11 pr-4 font-sans-ui text-[16px] sm:text-[14px] text-[#121418] outline-none transition focus:border-[#1F4FC7] focus:ring-2 focus:ring-[#1F4FC7]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-email"
                      className="block text-[12px] font-sans-ui font-bold text-[#121418] uppercase tracking-wider"
                    >
                      Email Address
                    </label>
                    <div className="relative mt-2">
                      <Mail
                        className="absolute top-3.5 left-4 size-4 text-[#6B707B]"
                        aria-hidden="true"
                      />
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        tabIndex={!isRegister ? -1 : 0}
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="karim@example.com"
                        className="h-[48px] w-full rounded-[14px] border border-[#E8E5DC] bg-white pl-11 pr-4 font-sans-ui text-[16px] sm:text-[14px] text-[#121418] outline-none transition focus:border-[#1F4FC7] focus:ring-2 focus:ring-[#1F4FC7]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="block text-[12px] font-sans-ui font-bold text-[#121418] uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <div className="relative mt-2">
                      <Lock
                        className="absolute top-3.5 left-4 size-4 text-[#6B707B]"
                        aria-hidden="true"
                      />
                      <input
                        id="register-password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        tabIndex={!isRegister ? -1 : 0}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="h-[48px] w-full rounded-[14px] border border-[#E8E5DC] bg-white pl-11 pr-4 font-sans-ui text-[16px] sm:text-[14px] text-[#121418] outline-none transition focus:border-[#1F4FC7] focus:ring-2 focus:ring-[#1F4FC7]/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    tabIndex={!isRegister ? -1 : 0}
                    aria-busy={loading}
                    className="btn-tactile mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#121418] font-sans-ui text-[14px] font-bold text-white shadow-xs hover:bg-[#1F4FC7] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>

                {/* Swipe Right Prompt & Trigger */}
                <div className="mt-8 rounded-[18px] border border-[#E8E5DC] bg-[#FFFFFF] p-4 text-center">
                  <p className="text-[13px] font-sans-ui text-[#4A4D55]">
                    Already registered?
                  </p>
                  <button
                    type="button"
                    tabIndex={!isRegister ? -1 : 0}
                    onClick={() => {
                      setIsRegister(false)
                      setError(null)
                    }}
                    className="group mt-2 inline-flex items-center gap-2 font-sans-ui text-[14px] font-bold text-[#1F4FC7] hover:text-[#163CA0] cursor-pointer"
                  >
                    <ArrowLeft
                      className="size-4 transition-transform duration-200 group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                    <span>Sign in to account</span>
                  </button>
                  <div className="mt-2 text-[11px] font-sans-ui text-[#6B707B]">
                    <span>Swipe right ⟶ or click above</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

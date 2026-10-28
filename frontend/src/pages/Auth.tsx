import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { authApi } from "../api/client"
import { useStore } from "../app/store"

export default function Auth() {
  const navigate = useNavigate()
  const { setUser } = useStore()

  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let result
      if (isRegister) {
        result = await authApi.register({ name, email, password })
      } else {
        result = await authApi.login({ email, password })
      }

      setUser({
        _id: result._id,
        name: result.name,
        email: result.email,
        token: result.token,
      })

      navigate("/")
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-dvh bg-white text-[#121f38] lg:grid-cols-[45.1389%_54.8611%]">
      <section className="bg-[#121f38] px-6 py-9 text-white sm:px-12 lg:min-h-dvh lg:px-[72px] lg:py-[66px]">
        <Link
          to="/"
          className="font-['Inter:Bold'] text-[32px] font-bold leading-normal tracking-[-0.5px]"
        >
          rowad store.
        </Link>

        <div className="mt-20 pb-4 sm:mt-28 lg:mt-[153px]">
          <h1 className="font-['Inter:Bold'] text-[40px] font-bold leading-[1.18] tracking-[-0.8px] sm:text-[44px]">
            Shopping that
            <br />
            feels easy.
          </h1>
          <p className="mt-[14px] font-['Inter:Regular'] text-[16px] font-normal leading-normal text-[#c7cfdb]">
            Discover thoughtful everyday essentials,
            <br className="hidden sm:block" /> all in one simple place.
          </p>
        </div>
      </section>

      <section className="flex px-6 py-14 sm:px-12 lg:min-h-dvh lg:items-start lg:py-0 lg:pl-[110px] lg:pr-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[520px] lg:pt-[140px]"
        >
          <h2 className="font-['Inter:Bold'] text-[30px] font-bold leading-normal tracking-[-0.4px]">
            {isRegister ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-[6px] font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
            {isRegister
              ? "Join Rowad Store to place orders and manage your profile."
              : "Sign in to continue to your account."}
          </p>

          {error && (
            <div className="mt-5 rounded-[10px] border border-red-200 bg-red-50 p-4 text-[13px] font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-[35px] space-y-[20px]">
            {isRegister && (
              <label className="block font-['Inter:Bold'] text-[13px] font-bold">
                Full Name
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="mt-[10px] h-[52px] w-full rounded-[10px] border border-[#e3e8f0] bg-white px-[17px] font-['Inter:Regular'] text-[14px] font-normal text-[#121f38] outline-none transition placeholder:text-[#6b7587] focus:border-[#1f4fc7] focus:ring-2 focus:ring-[#1f4fc7]/10"
                />
              </label>
            )}

            <label className="block font-['Inter:Bold'] text-[13px] font-bold">
              Email address
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-[10px] h-[52px] w-full rounded-[10px] border border-[#e3e8f0] bg-white px-[17px] font-['Inter:Regular'] text-[14px] font-normal text-[#121f38] outline-none transition placeholder:text-[#6b7587] focus:border-[#1f4fc7] focus:ring-2 focus:ring-[#1f4fc7]/10"
              />
            </label>

            <label className="block font-['Inter:Bold'] text-[13px] font-bold">
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder="Enter your password (min 6 chars)"
                className="mt-[10px] h-[52px] w-full rounded-[10px] border border-[#e3e8f0] bg-white px-[17px] font-['Inter:Regular'] text-[14px] font-normal text-[#121f38] outline-none transition placeholder:text-[#6b7587] focus:border-[#1f4fc7] focus:ring-2 focus:ring-[#1f4fc7]/10"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-[28px] h-[52px] w-full rounded-[12px] bg-[#1f4fc7] font-['Inter:Bold'] text-[14px] font-bold text-white transition hover:bg-[#173e9f] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Processing..." : isRegister ? "Sign up" : "Sign in"}
          </button>

          <p className="mt-[23px] text-center font-['Inter:Regular'] text-[13px] font-normal text-[#6b7587]">
            {isRegister ? "Already have an account?" : "New to Rowad Store?"}&nbsp;{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError(null)
              }}
              className="font-['Inter:Bold'] text-[13px] font-bold text-[#1f4fc7] hover:underline"
            >
              {isRegister ? "Sign in instead" : "Create an account"}
            </button>
          </p>
        </form>
      </section>
    </main>
  )
}

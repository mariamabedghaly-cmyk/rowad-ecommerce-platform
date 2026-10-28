import { type FormEvent, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router"
import { ShoppingBag, Search, User, LogOut, Sparkles } from "lucide-react"

import { useStore } from "../app/store"

const navigation = [
  { label: "Shop all", to: "/#products", category: null },
  { label: "Electronics", to: "/?category=ELECTRONICS#products", category: "ELECTRONICS" },
  { label: "Fashion", to: "/?category=FASHION#products", category: "FASHION" },
  { label: "Home & Living", to: "/?category=HOME%20%26%20LIVING#products", category: "HOME & LIVING" },
  { label: "Accessories", to: "/?category=ACCESSORIES#products", category: "ACCESSORIES" },
]

export default function StoreHeader() {
  const [query, setQuery] = useState("")
  const { cartCount, user, logout } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const search = new URLSearchParams()
    if (query.trim()) search.set("search", query.trim())
    navigate(`/?${search.toString()}#products`)
  }

  return (
    <>
      {/* Editorial Announcement Bar */}
      <div className="bg-[#121418] text-[#E8E5DC] text-[12px] border-b border-[#24272E]">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-[72px]">
          <p className="font-sans-ui font-medium tracking-wide flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-[#C2410C]" aria-hidden="true"></span>
            Complimentary express delivery on orders over EGP 1,500
          </p>
          <div className="hidden sm:flex items-center gap-6 text-[11px] text-[#A0A4AD] tracking-wider uppercase">
            <span className="flex items-center gap-1">
              <Sparkles className="size-3 text-[#C2410C]" aria-hidden="true" />
              Direct Concierge
            </span>
            <span aria-hidden="true">·</span>
            <span>14-Day Free Returns</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E5DC] transition-all">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3 sm:px-8 lg:flex-nowrap lg:px-[72px]">
          {/* Logo with distinctive branding anchor */}
          <Link
            to="/"
            aria-label="Rowad Store Home"
            className="shrink-0 font-display text-[26px] sm:text-[28px] font-extrabold tracking-tight text-[#121418] flex items-center group cursor-pointer"
          >
            <span>rowad</span>
            <span className="text-[#1F4FC7] ml-0.5 group-hover:text-[#C2410C] transition-colors">store</span>
            <span className="size-1.5 rounded-full bg-[#C2410C] ml-1 self-end mb-1.5" aria-hidden="true"></span>
          </Link>

          {/* Navigation Links */}
          <nav
            aria-label="Main navigation"
            className="order-3 flex w-full gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap text-[13px] font-sans-ui font-medium text-[#4A4D55] lg:order-none lg:ml-6 lg:w-auto py-1"
          >
            {navigation.map((item) => {
              const isActive =
                location.pathname === "/" &&
                ((!item.category && !location.search) ||
                  (item.category && location.search.includes(item.category)))
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`min-h-[44px] flex items-center px-3.5 py-2 rounded-full cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "bg-[#121418] text-white font-semibold shadow-xs"
                      : "hover:text-[#121418] hover:bg-[#F2EFE8]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Search Box */}
          <form
            onSubmit={submitSearch}
            role="search"
            className="order-2 ml-auto min-w-0 flex-1 sm:max-w-[260px] lg:order-none lg:ml-auto"
          >
            <label className="flex h-[44px] items-center rounded-full border border-[#E8E5DC] bg-[#FFFFFF] px-4 shadow-2xs transition-all focus-within:border-[#1F4FC7] focus-within:ring-2 focus-within:ring-[#1F4FC7]/10 cursor-text">
              <Search className="size-4 text-[#6B707B] mr-2 shrink-0" aria-hidden="true" />
              <span className="sr-only">Search products</span>
              <input
                id="header-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search collection..."
                className="w-full bg-transparent font-sans-ui text-[14px] text-[#121418] outline-none placeholder:text-[#6B707B]"
              />
            </label>
          </form>

          {/* User Account State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 pl-2">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#F4F2EC] border border-[#E8E5DC] font-display text-[13px] font-bold text-[#121418]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-[13px] font-sans-ui font-medium text-[#121418]">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Sign out of account"
                  title="Sign out"
                  className="flex size-9 items-center justify-center rounded-full text-[#6B707B] hover:text-[#C2410C] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="hidden sm:flex min-h-[44px] items-center gap-1.5 text-[13px] font-sans-ui font-semibold text-[#121418] px-3.5 py-2 rounded-full hover:bg-[#F2EFE8] transition-colors cursor-pointer"
              >
                <User className="size-4 text-[#4A4D55]" aria-hidden="true" />
                <span>Sign in</span>
              </Link>
            )}

            {/* Cart Button with Count Pill (Touch target >= 44x44px) */}
            <Link
              to="/cart"
              aria-label={`View shopping bag, ${cartCount} items`}
              className="btn-tactile inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-[#121418] px-4 text-[13px] font-sans-ui font-bold text-white shadow-xs transition hover:bg-[#2A2C30] cursor-pointer"
            >
              <ShoppingBag className="size-4 text-[#FAF9F6]" aria-hidden="true" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span
                  aria-label={`${cartCount} items in cart`}
                  className="flex size-5 items-center justify-center rounded-full bg-[#C2410C] text-[11px] font-bold text-white leading-none"
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

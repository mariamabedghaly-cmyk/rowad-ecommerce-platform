import { type FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router"

import { useStore } from "../app/store"

const navigation = [
  { label: "Shop all", to: "/#products" },
  { label: "Electronics", to: "/?category=ELECTRONICS#products" },
  { label: "Fashion", to: "/?category=FASHION#products" },
  { label: "Home & Living", to: "/?category=HOME%20%26%20LIVING#products" },
  { label: "Accessories", to: "/?category=ACCESSORIES#products" },
]

export default function StoreHeader() {
  const [query, setQuery] = useState("")
  const { cartCount, user, logout } = useStore()
  const navigate = useNavigate()

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const search = new URLSearchParams()
    if (query.trim()) search.set("search", query.trim())
    navigate(`/?${search.toString()}#products`)
  }

  return (
    <>
      <div className="h-[34px] bg-[#121f38] text-white">
        <div className="mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-[72px]">
          <p className="font-['Inter:Regular'] text-[12px] font-normal">
            Free delivery on orders over EGP 1,500
          </p>
        </div>
      </div>

      <header className="mx-auto flex min-h-[82px] max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 sm:px-8 lg:flex-nowrap lg:px-[72px]">
        <Link
          to="/"
          className="shrink-0 font-['Inter:Bold'] text-[30px] font-bold leading-none tracking-[-0.7px]"
        >
          rowad store.
        </Link>

        <nav
          aria-label="Main navigation"
          className="order-3 flex w-full gap-5 overflow-x-auto whitespace-nowrap font-['Inter:Regular'] text-[14px] font-normal lg:order-none lg:ml-auto lg:w-auto lg:gap-[25px]"
        >
          {navigation.map((item) => (
            <Link key={item.label} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="order-2 ml-auto min-w-0 flex-1 sm:max-w-[220px] lg:order-none lg:ml-auto"
        >
          <label className="flex h-[42px] items-center rounded-[10px] bg-[#f5f7fc] px-[15px]">
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent font-['Inter:Regular'] text-[13px] font-normal text-[#121f38] outline-none placeholder:text-[#6b7587]"
            />
          </label>
        </form>

        {user ? (
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="font-['Inter:Bold'] text-[14px] font-bold text-[#121f38]">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button
              onClick={logout}
              className="text-[12px] font-normal text-[#6b7587] transition hover:text-[#121f38]"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/sign-in"
            className="hidden shrink-0 font-['Inter:Bold'] text-[14px] font-bold sm:block"
          >
            Sign in
          </Link>
        )}
        <Link
          to="/cart"
          className="shrink-0 font-['Inter:Bold'] text-[14px] font-bold text-[#1f4fc7]"
        >
          Cart ({cartCount})
        </Link>
      </header>
    </>
  )
}

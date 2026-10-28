import { useMemo } from "react"
import { Link, useSearchParams } from "react-router"

import { formatPrice, useStore } from "../app/store"

const assetPath = "/assets"

const categories = [
  { name: "Electronics", description: "Headphones, gadgets & more" },
  { name: "Fashion", description: "Everyday style essentials" },
  { name: "Home & Living", description: "Make your space yours" },
  { name: "Accessories", description: "The finishing touches" },
]

const products = [
  {
    category: "ELECTRONICS",
    name: "Studio Wireless Headphones",
    rating: "4.8",
    price: "EGP 2,499",
    image: `${assetPath}/6ce96.png`,
  },
  {
    category: "FASHION",
    name: "Everyday Court Sneakers",
    rating: "4.7",
    price: "EGP 1,850",
    image: `${assetPath}/c3f85.png`,
  },
  {
    category: "HOME & LIVING",
    name: "Minimal Ceramic Lamp",
    rating: "4.9",
    price: "EGP 1,150",
    image: `${assetPath}/eb990.png`,
  },
  {
    category: "ACCESSORIES",
    name: "Everyday Carry Tote",
    rating: "4.6",
    price: "EGP 650",
    image: `${assetPath}/6ce96.png`,
  },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("search") ?? ""
  const selectedCategory = searchParams.get("category")
  const { cartCount, addQuantity, products } = useStore()

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase()
    return products.filter(
      (product) =>
        (!selectedCategory || product.category === selectedCategory) &&
        (!search ||
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)),
    )
  }, [query, selectedCategory])

  const scrollToProducts = () =>
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" })

  const showCategory = (category?: string) => {
    const next = new URLSearchParams(searchParams)
    if (category) next.set("category", category)
    else next.delete("category")
    setSearchParams(next)
    requestAnimationFrame(scrollToProducts)
  }

  return (
    <div className="min-h-dvh bg-white text-[#121f38]">
      <div className="bg-[#121f38] px-5 py-[9px] text-white sm:px-8 lg:px-[72px]">
        <p className="font-['Inter:Regular'] text-[12px] leading-4">
          Free delivery on orders over EGP 1,500&nbsp; • &nbsp;Easy returns
          within 14 days
        </p>
      </div>

      <header className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 sm:px-8 lg:flex-nowrap lg:px-[72px] lg:py-[20px]">
        <Link
          to="/"
          className="shrink-0 font-['Inter:Bold'] text-[27px] font-bold tracking-[-0.8px]"
        >
          rowad<span className="text-[#1f4fc7]">store.</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="order-3 flex w-full gap-5 overflow-x-auto whitespace-nowrap font-['Inter:Regular'] text-[13px] lg:order-none lg:w-auto lg:flex-1 lg:gap-6"
        >
          <button onClick={() => showCategory()}>Shop all</button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => showCategory(category.name.toUpperCase())}
            >
              {category.name}
            </button>
          ))}
        </nav>

        <label className="order-2 ml-auto flex h-[42px] min-w-0 flex-1 items-center rounded-[10px] bg-[#f5f7fc] px-4 sm:max-w-[245px] lg:order-none">
          <span aria-hidden="true" className="mr-2 text-[#6b7587]">
            ⌕
          </span>
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams)
              if (event.target.value) next.set("search", event.target.value)
              else next.delete("search")
              setSearchParams(next, { replace: true })
            }}
            placeholder="Search products..."
            className="w-full bg-transparent font-['Inter:Regular'] text-[13px] text-[#121f38] outline-none placeholder:text-[#6b7587]"
          />
        </label>

        <Link
          to="/sign-in"
          className="hidden font-['Inter:Bold'] text-[14px] font-bold sm:block"
        >
          Sign in
        </Link>
        <Link
          to="/cart"
          className="inline-flex h-[42px] shrink-0 items-center rounded-[10px] bg-[#1f4fc7] px-[18px] font-['Inter:Bold'] text-[13px] font-bold text-white transition hover:bg-[#173e9f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4fc7]"
        >
          Cart ({cartCount})
        </Link>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-[56px] sm:px-8 lg:px-[72px]">
        <section className="grid overflow-hidden rounded-[24px] bg-[#f0f5ff] px-7 py-8 sm:px-12 lg:min-h-[360px] lg:grid-cols-[1fr_520px] lg:items-center lg:gap-16 lg:px-12 lg:py-[34px]">
          <div>
            <p className="font-['Inter:Bold'] text-[12px] font-bold text-[#1f4fc7]">
              THE EVERYDAY EDIT
            </p>
            <h1 className="mt-3 font-['Inter:Bold'] text-[40px] font-bold leading-[1.12] tracking-[-1.2px] sm:text-[48px]">
              Good finds.
              <br />
              Better everyday.
            </h1>
            <p className="mt-4 font-['Inter:Regular'] text-[16px] leading-[25px] text-[#6b7587]">
              Thoughtful picks for your home, style, and tech.
              <br className="hidden sm:block" /> Everything you need, all in one
              place.
            </p>
            <button
              onClick={scrollToProducts}
              className="mt-6 h-[48px] rounded-[12px] bg-[#1f4fc7] px-4 font-['Inter:Bold'] text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#173e9f]"
            >
              Explore collection&nbsp; →
            </button>
          </div>
          <img
            src={`${assetPath}/feb22.png`}
            alt="A curated arrangement of headphones, a sneaker, a smart case, and home decor"
            className="mt-8 h-[250px] w-full rounded-[18px] object-cover lg:mt-0 lg:h-[292px]"
          />
        </section>

        <section id="categories" className="scroll-mt-5 pt-[46px]">
          <h2 className="font-['Inter:Bold'] text-[26px] font-bold leading-tight">
            Shop by category
          </h2>
          <p className="mt-2 font-['Inter:Regular'] text-[14px] text-[#6b7587]">
            A little something for every part of your day.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => showCategory(category.name.toUpperCase())}
                className="min-h-[112px] rounded-[16px] bg-[#f5f7fc] px-[18px] py-5 text-left transition hover:-translate-y-0.5 hover:bg-[#eef2fa]"
              >
                <span className="block font-['Inter:Bold'] text-[17px] font-bold">
                  {category.name}
                </span>
                <span className="mt-3 block font-['Inter:Regular'] text-[12px] text-[#6b7587]">
                  {category.description}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section id="products" className="scroll-mt-5 pt-[55px]">
          <h2 className="font-['Inter:Bold'] text-[26px] font-bold leading-tight">
            Trending right now
          </h2>
          <p className="mt-2 font-['Inter:Regular'] text-[14px] text-[#6b7587]">
            Customer favourites, picked for you.
          </p>

          {filteredProducts.length ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.name}
                  className="overflow-hidden rounded-[16px] border border-[#e3e8f0] bg-white p-[15px]"
                >
                  <Link to="/product" aria-label={`View ${product.name}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-[235px] w-full rounded-[12px] object-cover"
                    />
                  </Link>
                  <p className="mt-[14px] font-['Inter:Bold'] text-[10px] font-bold text-[#1f4fc7]">
                    {product.category}
                  </p>
                  <h3 className="mt-[7px] font-['Inter:Bold'] text-[16px] font-bold leading-5">
                    <Link to="/product">{product.name}</Link>
                  </h3>
                  <p className="mt-[9px] font-['Inter:Regular'] text-[12px] text-[#6b7587]">
                    ★ {product.rating}&nbsp; · &nbsp;Free returns
                  </p>
                  <p className="mt-[10px] font-['Inter:Bold'] text-[17px] font-bold">
                    {typeof product.price === "number" ? formatPrice(product.price) : product.price}
                  </p>
                  <button
                    onClick={() => addQuantity(products.indexOf(product))}
                    className="mt-2 h-[40px] w-full rounded-[10px] bg-[#1f4fc7] font-['Inter:Bold'] text-[13px] font-bold text-white transition hover:bg-[#173e9f] active:scale-[0.99]"
                  >
                    Add to cart&nbsp; +
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[16px] border border-[#e3e8f0] p-10 text-center font-['Inter:Regular'] text-[#6b7587]">
              No products match “{query}”.
            </div>
          )}
        </section>

        <section
          id="support"
          className="mt-[56px] grid min-h-[110px] scroll-mt-5 items-center gap-5 rounded-[18px] bg-[#f5f7fc] px-8 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-[52px]"
        >
          {[
            "✓  Secure checkout",
            "↗  Fast delivery",
            "♡  Easy returns",
            "✦  Helpful support",
          ].map((item) => (
            <p key={item} className="font-['Inter:Bold'] text-[14px] font-bold">
              {item}
            </p>
          ))}
        </section>
      </main>

      <footer id="about" className="min-h-[340px] bg-[#121f38] text-white">
        <div className="mx-auto flex min-h-[340px] max-w-[1440px] flex-col px-5 py-[48px] sm:px-8 lg:px-[72px]">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <p className="font-['Inter:Bold'] text-[28px] font-bold">
                rowad store.
              </p>
              <p className="mt-4 font-['Inter:Regular'] text-[14px] text-[#c7cfdb]">
                Your everyday shopping, made simpler.
              </p>
            </div>
            <nav className="flex flex-wrap gap-7 font-['Inter:Regular'] text-[14px]">
              <a href="#products">Shop</a>
              <a href="#about">About us</a>
              <a href="#support">Help center</a>
              <a href="mailto:support@rowad.store">Contact</a>
            </nav>
          </div>
          <p className="mt-auto pt-12 font-['Inter:Regular'] text-[12px] text-[#adb8c7]">
            © 2026 Rowad Store. Prototype concept — demo only.
          </p>
        </div>
      </footer>
    </div>
  )
}

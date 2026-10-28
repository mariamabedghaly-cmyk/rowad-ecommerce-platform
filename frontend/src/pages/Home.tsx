import { useMemo } from "react"
import { Link, useSearchParams } from "react-router"
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Sparkles, Plus, X } from "lucide-react"

import { formatPrice, useStore } from "../app/store"
import StoreHeader from "../components/StoreHeader"

const categories = [
  {
    id: "01",
    name: "Electronics",
    code: "ELECTRONICS",
    description: "Headphones, acoustics & minimal gadgets",
    badge: "12 Items",
  },
  {
    id: "02",
    name: "Fashion",
    code: "FASHION",
    description: "Everyday silhouettes & court staples",
    badge: "24 Items",
  },
  {
    id: "03",
    name: "Home & Living",
    code: "HOME & LIVING",
    description: "Ceramic accents, lighting & functional decor",
    badge: "18 Items",
  },
  {
    id: "04",
    name: "Accessories",
    code: "ACCESSORIES",
    description: "Canvas carry, leather goods & finishing touches",
    badge: "16 Items",
  },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("search") ?? ""
  const selectedCategory = searchParams.get("category")
  const { addQuantity, products } = useStore()

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase()
    return products.filter(
      (product) =>
        (!selectedCategory || product.category === selectedCategory) &&
        (!search ||
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)),
    )
  }, [query, selectedCategory, products])

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
    <div className="min-h-dvh bg-[#FAF9F6] text-[#121418]">
      <StoreHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-[72px]">
        {/* Asymmetrical Editorial Hero Section */}
        <section
          aria-labelledby="hero-heading"
          className="mt-6 overflow-hidden rounded-[28px] border border-[#E8E5DC] bg-[#FFFFFF] p-8 sm:p-12 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:p-14 shadow-xs"
        >
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E5DC] bg-[#F4F2EC] px-3.5 py-1 text-[11px] font-sans-ui font-semibold tracking-wider text-[#121418] uppercase">
              <span className="size-1.5 rounded-full bg-[#C2410C]" aria-hidden="true"></span>
              The Everyday Edit · Vol. 01
            </div>

            <h1
              id="hero-heading"
              className="mt-5 font-display text-[42px] sm:text-[54px] font-extrabold leading-[1.08] tracking-tight text-[#121418]"
            >
              Good finds. <br />
              <span className="font-editorial italic font-normal text-[#4A4D55]">
                Better everyday.
              </span>
            </h1>

            <p className="mt-5 font-sans-ui text-[16px] sm:text-[17px] leading-relaxed text-[#4A4D55]">
              Thoughtfully curated objects for your home, style, and tech. Built with enduring materials, functional ergonomics, and quiet elegance.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToProducts}
                className="btn-tactile inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#121418] px-7 text-[14px] font-sans-ui font-bold text-white shadow-xs hover:bg-[#2A2C30] cursor-pointer"
              >
                <span>Explore collection</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => showCategory("ELECTRONICS")}
                className="btn-tactile inline-flex min-h-[48px] items-center rounded-full border border-[#E8E5DC] bg-[#FAF9F6] px-6 text-[14px] font-sans-ui font-semibold text-[#121418] hover:bg-[#F2EFE8] cursor-pointer"
              >
                Featured Drop
              </button>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-0">
            <div className="overflow-hidden rounded-[22px] border border-[#E8E5DC] shadow-sm">
              <img
                src="/assets/feb22.png"
                alt="A curated arrangement of headphones, a sneaker, a smart case, and home decor"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80"
                }}
                className="h-[280px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:h-[340px] lg:h-[360px]"
              />
            </div>

            {/* Tactile floating badge */}
            <div className="absolute -bottom-4 right-6 hidden sm:flex items-center gap-2.5 rounded-full border border-[#E8E5DC] bg-white/95 px-4 py-2.5 shadow-md backdrop-blur-md">
              <Sparkles className="size-4 text-[#C2410C]" aria-hidden="true" />
              <span className="font-sans-ui text-[12px] font-bold text-[#121418] tracking-wide">
                CURATED IN CAIRO · 2026
              </span>
            </div>
          </div>
        </section>

        {/* Value Proposition Ribbon */}
        <section
          aria-label="Service perks"
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {[
            { icon: Truck, title: "Express Dispatch", desc: "Same-day Cairo delivery" },
            { icon: ShieldCheck, title: "Verified Authentic", desc: "100% genuine guarantees" },
            { icon: RotateCcw, title: "14-Day Returns", desc: "Zero questions asked" },
            { icon: Sparkles, title: "Dedicated Support", desc: "Live human assistance" },
          ].map((perk) => (
            <div
              key={perk.title}
              className="flex items-center gap-3.5 rounded-[16px] border border-[#E8E5DC] bg-white p-4 shadow-2xs"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F4F2EC] text-[#121418]">
                <perk.icon className="size-5 text-[#C2410C]" aria-hidden="true" />
              </div>
              <div>
                <p className="font-sans-ui text-[13px] font-bold text-[#121418]">
                  {perk.title}
                </p>
                <p className="font-sans-ui text-[11px] text-[#4A4D55]">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Categories Section */}
        <section id="categories" className="scroll-mt-24 pt-16">
          <div className="flex items-end justify-between border-b border-[#E8E5DC] pb-4">
            <div>
              <p className="text-[12px] font-sans-ui font-bold uppercase tracking-wider text-[#C2410C]">
                Explore Departments
              </p>
              <h2 className="mt-1 font-display text-[28px] sm:text-[32px] font-bold tracking-tight text-[#121418]">
                Shop by category
              </h2>
            </div>
            <button
              type="button"
              onClick={() => showCategory()}
              className="min-h-[44px] flex items-center text-[13px] font-sans-ui font-semibold text-[#1F4FC7] hover:underline cursor-pointer"
            >
              View all ({products.length})
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                type="button"
                key={category.name}
                onClick={() => showCategory(category.code)}
                className="card-hover-lift group rounded-[20px] border border-[#E8E5DC] bg-white p-6 text-left cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[14px] font-bold text-[#6B707B]">
                    {category.id}
                  </span>
                  <span className="rounded-full bg-[#F4F2EC] px-2.5 py-0.5 text-[11px] font-sans-ui font-medium text-[#4A4D55]">
                    {category.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[18px] font-bold text-[#121418] group-hover:text-[#1F4FC7] transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-[13px] font-sans-ui leading-relaxed text-[#4A4D55]">
                  {category.description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-[12px] font-sans-ui font-bold text-[#121418] group-hover:text-[#1F4FC7]">
                  <span>Explore</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Trending Products Showcase */}
        <section id="products" className="scroll-mt-24 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E8E5DC] pb-4">
            <div>
              <p className="text-[12px] font-sans-ui font-bold uppercase tracking-wider text-[#C2410C]">
                Curated Selection
              </p>
              <h2 className="mt-1 font-display text-[28px] sm:text-[32px] font-bold tracking-tight text-[#121418]">
                Trending right now
              </h2>
            </div>
            {selectedCategory && (
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-sans-ui text-[#4A4D55]">
                  Filtered by: <strong>{selectedCategory}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => showCategory()}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-full bg-[#F4F2EC] px-3.5 py-1 text-[12px] font-sans-ui font-semibold text-[#121418] hover:bg-[#E8E5DC] cursor-pointer"
                >
                  <span>Clear filter</span>
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {filteredProducts.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const prodIndex = products.findIndex(
                  (p) => (p.id && p.id === product.id) || p.name === product.name,
                )
                const targetId = product.id || (prodIndex !== -1 ? prodIndex : 0)

                return (
                  <article
                    key={product.name}
                    className="card-hover-lift group flex flex-col overflow-hidden rounded-[22px] border border-[#E8E5DC] bg-white p-4 cursor-pointer"
                  >
                    {/* Aspect-ratio image container */}
                    <Link
                      to={`/product?id=${targetId}`}
                      aria-label={`View ${product.name} details`}
                      className="relative block aspect-[4/3.8] overflow-hidden rounded-[16px] bg-[#F4F2EC] cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-sans-ui font-bold uppercase tracking-wider text-[#121418] shadow-xs backdrop-blur-xs">
                        {product.category}
                      </span>
                    </Link>

                    {/* Product Metadata */}
                    <div className="mt-4 flex flex-1 flex-col">
                      <div className="flex items-center gap-1.5 text-[12px] font-sans-ui font-medium text-[#4A4D55]">
                        <Star className="size-3.5 fill-[#C2410C] text-[#C2410C]" aria-hidden="true" />
                        <span className="font-bold text-[#121418]">{product.rating}</span>
                        <span>· Free Returns</span>
                      </div>

                      <h3 className="mt-2 font-display text-[16px] font-bold leading-snug text-[#121418]">
                        <Link
                          to={`/product?id=${targetId}`}
                          className="hover:text-[#1F4FC7] transition-colors cursor-pointer"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <p className="font-display text-[18px] font-bold text-[#121418]">
                          {typeof product.price === "number"
                            ? formatPrice(product.price)
                            : product.price}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addQuantity(prodIndex !== -1 ? prodIndex : 0)}
                        aria-label={`Add ${product.name} to cart`}
                        className="btn-tactile mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[12px] bg-[#121418] font-sans-ui text-[13px] font-bold text-white transition hover:bg-[#1F4FC7] cursor-pointer"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                        <span>Add to cart</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[20px] border border-dashed border-[#E8E5DC] bg-white p-12 text-center">
              <p className="font-display text-[18px] font-bold text-[#121418]">
                No pieces found matching “{query}”
              </p>
              <button
                type="button"
                onClick={() => showCategory()}
                className="mt-3 inline-flex min-h-[44px] items-center text-[13px] font-sans-ui font-semibold text-[#1F4FC7] hover:underline cursor-pointer"
              >
                Clear search and view all products
              </button>
            </div>
          )}
        </section>

        {/* Our Story & Quality Standards (The Rowad Standard) */}
        <section
          aria-labelledby="story-heading"
          className="mt-20 overflow-hidden rounded-[28px] border border-[#E8E5DC] bg-white p-8 sm:p-12 lg:p-14 shadow-xs lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:items-center"
        >
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E5DC] bg-[#F4F2EC] px-3.5 py-1 text-[11px] font-sans-ui font-semibold tracking-wider text-[#121418] uppercase">
              <span className="size-1.5 rounded-full bg-[#C2410C]" aria-hidden="true"></span>
              Our Story & Quality Standards
            </div>

            <h2
              id="story-heading"
              className="mt-4 font-display text-[32px] sm:text-[42px] font-extrabold leading-[1.12] tracking-tight text-[#121418]"
            >
              The Rowad Standard. <br />
              <span className="font-editorial italic font-normal text-[#4A4D55]">
                Curated for everyday life.
              </span>
            </h2>

            <p className="mt-4 font-sans-ui text-[15px] sm:text-[16px] leading-relaxed text-[#4A4D55]">
              Founded in Cairo, Rowad was created with a clear purpose: everyday essentials should be built to endure. We partner directly with vetted artisans and certified manufacturers to deliver premium goods without retail markups.
            </p>

            <div className="mt-8 space-y-4 border-t border-[#E8E5DC] pt-6">
              <div className="flex items-start gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF7ED] text-[#C2410C]">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-sans-ui text-[14px] font-bold text-[#121418]">
                    100% Inspected & Certified Authentic
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#4A4D55]">
                    Every single product undergoes physical inspection and material grading before leaving our Cairo fulfillment center.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF7ED] text-[#C2410C]">
                  <Truck className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-sans-ui text-[14px] font-bold text-[#121418]">
                    Express Courier & 14-Day Free Returns
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#4A4D55]">
                    Enjoy expedited delivery across all Egyptian governorates with a 14-day zero-hassle exchange and return policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToProducts}
                className="btn-tactile inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#121418] px-6 text-[13px] font-sans-ui font-bold text-white shadow-xs hover:bg-[#1F4FC7] cursor-pointer"
              >
                <span>Shop Certified Products</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative mt-10 lg:mt-0 flex justify-center">
            <div className="relative overflow-hidden rounded-[22px] border border-[#E8E5DC] shadow-sm max-w-[460px] w-full">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
                alt="Rowad workshop curation and quality craftsmanship"
                className="h-[340px] sm:h-[400px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute -bottom-1 -right-1 rounded-tl-[18px] bg-white p-4 border-t border-l border-[#E8E5DC] shadow-md flex items-center gap-3">
                <Sparkles className="size-5 text-[#C2410C]" aria-hidden="true" />
                <div>
                  <p className="font-sans-ui text-[12px] font-bold text-[#121418]">
                    Egyptian Craft & Quality
                  </p>
                  <p className="text-[11px] text-[#4A4D55]">
                    Backed by local warranty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Multi-Column Footer */}
      <footer id="about" className="border-t border-[#E8E5DC] bg-[#FFFFFF] text-[#121418]">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-[72px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link to="/" className="font-display text-[26px] font-extrabold text-[#121418]">
                rowad<span className="text-[#1F4FC7]">store</span>
                <span className="text-[#C2410C]">.</span>
              </Link>
              <p className="mt-3 max-w-[340px] font-sans-ui text-[14px] leading-relaxed text-[#4A4D55]">
                Everyday shopping reimagined with intentional curation, authentic craft, and reliable Cairo express fulfillment.
              </p>
            </div>

            <div>
              <p className="font-sans-ui text-[13px] font-bold uppercase tracking-wider text-[#121418]">
                Collections
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] font-sans-ui text-[#4A4D55]">
                <li><button type="button" onClick={() => showCategory("ELECTRONICS")} className="hover:text-[#121418] cursor-pointer">Electronics</button></li>
                <li><button type="button" onClick={() => showCategory("FASHION")} className="hover:text-[#121418] cursor-pointer">Fashion</button></li>
                <li><button type="button" onClick={() => showCategory("HOME & LIVING")} className="hover:text-[#121418] cursor-pointer">Home & Living</button></li>
                <li><button type="button" onClick={() => showCategory("ACCESSORIES")} className="hover:text-[#121418] cursor-pointer">Accessories</button></li>
              </ul>
            </div>

            <div>
              <p className="font-sans-ui text-[13px] font-bold uppercase tracking-wider text-[#121418]">
                Company
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] font-sans-ui text-[#4A4D55]">
                <li><a href="#about" className="hover:text-[#121418]">About Rowad</a></li>
                <li><a href="#support" className="hover:text-[#121418]">Help Center</a></li>
                <li><a href="mailto:concierge@rowad.store" className="hover:text-[#121418]">Concierge</a></li>
              </ul>
            </div>

            <div>
              <p className="font-sans-ui text-[13px] font-bold uppercase tracking-wider text-[#121418]">
                Assurance
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] font-sans-ui text-[#4A4D55]">
                <li className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-[#C2410C]" /> Egyptian Ministry Certified</li>
                <li className="flex items-center gap-1.5"><RotateCcw className="size-4 text-[#C2410C]" /> 14-Day Free Exchange</li>
                <li className="flex items-center gap-1.5"><Truck className="size-4 text-[#C2410C]" /> Encrypted Checkout</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E8E5DC] pt-8 sm:flex-row text-[12px] font-sans-ui text-[#6B707B]">
            <p>© 2026 Rowad Store. Built with UI/UX Pro Max intelligence.</p>
            <div className="flex gap-6">
              <span>Cairo, Egypt</span>
              <span aria-hidden="true">·</span>
              <span>EGP Currency</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

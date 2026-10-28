import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { Star, ShieldCheck, Truck, RotateCcw, ArrowLeft, ShoppingBag, Minus, Plus, Check } from "lucide-react"

import { formatPrice, useStore } from "../app/store"
import StoreHeader from "../components/StoreHeader"

export default function Product() {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [searchParams] = useSearchParams()
  const { addQuantity, products } = useStore()
  const navigate = useNavigate()

  const idParam = searchParams.get("id")
  const productIndex = products.findIndex(
    (p, idx) =>
      (p.id && String(p.id) === String(idParam)) ||
      String(idx) === String(idParam) ||
      p.name === idParam,
  )
  const activeIndex = productIndex !== -1 ? productIndex : 0
  const currentProduct = products[activeIndex] || products[0]

  const variants = [
    { name: "Obsidian Black", color: "#121418", border: "#121418" },
    { name: "Raw Linen", color: "#E8E2D5", border: "#D4CEBF" },
    { name: "Terracotta Earth", color: "#C2410C", border: "#C2410C" },
  ]

  const addToCart = () => {
    addQuantity(activeIndex, quantity)
    navigate("/cart")
  }

  return (
    <div className="min-h-dvh bg-[#FAF9F6] text-[#121418]">
      <StoreHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-[72px]">
        {/* Breadcrumb Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[13px] font-sans-ui text-[#4A4D55]"
          >
            <Link to="/" className="hover:text-[#121418] transition-colors cursor-pointer">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to={`/?category=${encodeURIComponent(currentProduct.category)}#products`}
              className="hover:text-[#121418] transition-colors font-medium text-[#121418] cursor-pointer"
            >
              {currentProduct.category}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate max-w-[200px] sm:max-w-none text-[#6B707B]">
              {currentProduct.name}
            </span>
          </nav>

          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[12px] font-sans-ui font-bold text-[#121418] hover:text-[#1F4FC7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Back to collection</span>
          </Link>
        </div>

        {/* Product Hero Layout */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:items-start">
          {/* Product Gallery View */}
          <div className="overflow-hidden rounded-[26px] border border-[#E8E5DC] bg-white p-4 shadow-xs">
            <div className="relative aspect-[4/3.8] overflow-hidden rounded-[20px] bg-[#F4F2EC]">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                }}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-sans-ui font-bold uppercase tracking-wider text-[#121418] shadow-xs backdrop-blur-md">
                {currentProduct.category}
              </span>
            </div>
          </div>

          {/* Product Information & Purchase Area */}
          <div className="lg:py-2">
            <div className="flex items-center gap-2 text-[13px] font-sans-ui text-[#4A4D55]">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-[#C2410C] text-[#C2410C]" aria-hidden="true" />
                <span className="font-bold text-[#121418]">{currentProduct.rating}</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>128 Verified Owner Reviews</span>
            </div>

            <h1 className="mt-3 font-display text-[34px] sm:text-[42px] font-extrabold leading-[1.12] tracking-tight text-[#121418]">
              {currentProduct.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-display text-[30px] font-bold text-[#121418]">
                {typeof currentProduct.price === "number"
                  ? formatPrice(currentProduct.price)
                  : currentProduct.price}
              </span>
              <span className="rounded-full bg-[#FFF7ED] border border-[#FFEDD5] px-2.5 py-0.5 text-[11px] font-sans-ui font-bold text-[#C2410C]">
                In Stock · Cairo Express Ready
              </span>
            </div>

            <p className="mt-5 font-sans-ui text-[15px] sm:text-[16px] leading-relaxed text-[#4A4D55]">
              Engineered with premium materials and ergonomic balance. Designed to seamlessly fit into your daily routine with uncompromising tactile pleasure and durability.
            </p>

            {/* Color / Variant Selector (Accessible touch target >= 44x44px) */}
            <div className="mt-8 border-t border-[#E8E5DC] pt-6">
              <div className="flex items-center justify-between">
                <p className="font-sans-ui text-[13px] font-bold text-[#121418]">
                  Color Finish: <span className="font-normal text-[#4A4D55]">{variants[selectedVariant].name}</span>
                </p>
              </div>

              <div className="mt-3 flex items-center gap-3">
                {variants.map((variant, idx) => (
                  <button
                    type="button"
                    key={variant.name}
                    onClick={() => setSelectedVariant(idx)}
                    aria-label={`Select color ${variant.name}`}
                    aria-pressed={selectedVariant === idx}
                    className={`size-11 rounded-full transition-all flex items-center justify-center cursor-pointer border ${
                      selectedVariant === idx
                        ? "ring-2 ring-[#121418] ring-offset-2 scale-105"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: variant.color, borderColor: variant.border }}
                  >
                    {selectedVariant === idx && (
                      <Check className={`size-4 ${idx === 1 ? "text-[#121418]" : "text-white"}`} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Control & CTA (Touch targets >= 44px) */}
            <div className="mt-8 border-t border-[#E8E5DC] pt-6 flex flex-wrap items-center gap-4">
              <div className="flex h-[48px] w-[140px] items-center justify-between rounded-full border border-[#E8E5DC] bg-white px-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex size-10 items-center justify-center rounded-full text-[#121418] hover:bg-[#F4F2EC] hover:text-[#C2410C] transition-colors cursor-pointer"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span
                  aria-live="polite"
                  className="font-sans-ui text-[15px] font-bold text-[#121418]"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="flex size-10 items-center justify-center rounded-full text-[#121418] hover:bg-[#F4F2EC] hover:text-[#C2410C] transition-colors cursor-pointer"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={addToCart}
                className="btn-tactile flex-1 min-w-[200px] min-h-[48px] rounded-full bg-[#121418] px-8 text-[14px] font-sans-ui font-bold text-white shadow-xs hover:bg-[#1F4FC7] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="size-4" aria-hidden="true" />
                <span>
                  Add to Cart · {formatPrice((typeof currentProduct.price === "number" ? currentProduct.price : 999) * quantity)}
                </span>
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="mt-8 grid grid-cols-3 gap-3 rounded-[18px] border border-[#E8E5DC] bg-white p-4 text-center">
              <div>
                <Truck className="mx-auto size-5 text-[#C2410C]" aria-hidden="true" />
                <p className="mt-1 font-sans-ui text-[12px] font-bold">Fast Delivery</p>
                <p className="text-[10px] text-[#4A4D55]">Next day in Cairo</p>
              </div>
              <div className="border-x border-[#E8E5DC]">
                <RotateCcw className="mx-auto size-5 text-[#C2410C]" aria-hidden="true" />
                <p className="mt-1 font-sans-ui text-[12px] font-bold">14 Days</p>
                <p className="text-[10px] text-[#4A4D55]">Simple return</p>
              </div>
              <div>
                <ShieldCheck className="mx-auto size-5 text-[#C2410C]" aria-hidden="true" />
                <p className="mt-1 font-sans-ui text-[12px] font-bold">Warranty</p>
                <p className="text-[10px] text-[#4A4D55]">1-Year full cover</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Breakdown */}
        <section className="mt-20 border-t border-[#E8E5DC] pt-12">
          <h2 className="font-display text-[24px] font-bold text-[#121418]">
            Product Specifications & Details
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[18px] border border-[#E8E5DC] bg-white p-6">
              <h3 className="font-sans-ui text-[14px] font-bold text-[#121418]">Materials & Finish</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#4A4D55]">
                Constructed using reinforced, eco-certified materials designed for everyday endurance without weight penalty.
              </p>
            </div>
            <div className="rounded-[18px] border border-[#E8E5DC] bg-white p-6">
              <h3 className="font-sans-ui text-[14px] font-bold text-[#121418]">Packaging & Origin</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#4A4D55]">
                Ships in recyclable, shock-resistant editorial boxes with genuine certificate of authenticity included.
              </p>
            </div>
            <div className="rounded-[18px] border border-[#E8E5DC] bg-white p-6">
              <h3 className="font-sans-ui text-[14px] font-bold text-[#121418]">Care & Maintenance</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#4A4D55]">
                Wipe clean with a dry microfiber cloth. Avoid abrasive chemical solvents to preserve tactile texture.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

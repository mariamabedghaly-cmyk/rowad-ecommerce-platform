import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck, Minus, Plus, Sparkles } from "lucide-react"
import { Link, useNavigate } from "react-router"

import { formatPrice, useStore } from "../app/store"
import StoreHeader from "../components/StoreHeader"

function QuantityControl({
  quantity,
  onChange,
}: {
  quantity: number
  onChange: (quantity: number) => void
}) {
  return (
    <div className="flex h-10 w-[124px] items-center justify-between rounded-full border border-[#E8E5DC] bg-white px-1.5 shadow-2xs">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="flex size-8 items-center justify-center rounded-full text-[#121418] hover:bg-[#F4F2EC] hover:text-[#C2410C] transition-colors cursor-pointer"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className="font-sans-ui text-[13px] font-bold text-[#121418]"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className="flex size-8 items-center justify-center rounded-full text-[#121418] hover:bg-[#F4F2EC] hover:text-[#C2410C] transition-colors cursor-pointer"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default function Cart() {
  const { quantities, cartCount, subtotal, updateQuantity, removeProduct, products } =
    useStore()
  const navigate = useNavigate()
  const cartProducts = products
    .map((product, index) => ({ product, index }))
    .filter(({ index }) => quantities[index] > 0)

  const freeShippingThreshold = 1500
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <div className="min-h-dvh bg-[#FAF9F6] text-[#121418]">
      <StoreHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-[72px]">
        {/* Cart Title & Header */}
        <section className="mt-8 flex items-baseline justify-between border-b border-[#E8E5DC] pb-4">
          <div>
            <h1 className="font-display text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#121418]">
              Your Cart
            </h1>
            <p className="mt-1 font-sans-ui text-[14px] text-[#4A4D55]">
              {cartCount === 1 ? "1 item in your bag" : `${cartCount} items in your bag`}
            </p>
          </div>
          <Link
            to="/#products"
            className="hidden sm:inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-sans-ui font-semibold text-[#1F4FC7] hover:underline cursor-pointer"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Continue shopping</span>
          </Link>
        </section>

        {/* Free Shipping Progress Indicator */}
        {cartProducts.length > 0 && (
          <div className="mt-6 rounded-[18px] border border-[#E8E5DC] bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-[13px] font-sans-ui">
              <span className="font-bold text-[#121418] flex items-center gap-2">
                <Sparkles className="size-4 text-[#C2410C]" aria-hidden="true" />
                {remainingForFree > 0
                  ? `Add ${formatPrice(remainingForFree)} more for Complimentary Express Shipping`
                  : "You have unlocked Free Express Shipping!"}
              </span>
              <span className="font-bold text-[#C2410C]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#F4F2EC]">
              <div
                role="progressbar"
                aria-valuenow={Math.round(freeShippingProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-full bg-[#121418] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* Cart Item List */}
          <section aria-label="Cart items" className="space-y-4">
            {cartProducts.length ? (
              cartProducts.map(({ product, index }) => (
                <article
                  key={product.name}
                  className="card-hover-lift relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-[20px] border border-[#E8E5DC] bg-white p-4"
                >
                  {/* Thumbnail */}
                  <div className="size-[100px] shrink-0 overflow-hidden rounded-[14px] bg-[#F4F2EC]">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                      }}
                      className="size-full object-cover"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-sans-ui font-bold uppercase tracking-wider text-[#C2410C]">
                      {product.category}
                    </span>
                    <h2 className="mt-0.5 font-display text-[16px] font-bold text-[#121418] truncate">
                      {product.name}
                    </h2>
                    <p className="mt-1 font-display text-[15px] font-bold text-[#121418]">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  {/* Controls (Touch targets >= 44px) */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <QuantityControl
                      quantity={quantities[index]}
                      onChange={(quantity) => updateQuantity(index, quantity)}
                    />
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="flex size-10 items-center justify-center rounded-full text-[#6B707B] transition hover:bg-[#FFF1F2] hover:text-[#E11D48] cursor-pointer"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#E8E5DC] bg-white px-6 py-16 text-center">
                <ShoppingBag className="mx-auto size-12 text-[#C2410C]" aria-hidden="true" />
                <p className="mt-4 font-display text-[20px] font-bold text-[#121418]">
                  Your cart is currently empty
                </p>
                <p className="mt-1 text-[14px] font-sans-ui text-[#4A4D55]">
                  Explore our curated catalogue and pick pieces built for your day.
                </p>
                <Link
                  to="/#products"
                  className="btn-tactile mt-6 inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#121418] px-6 text-[13px] font-sans-ui font-bold text-white shadow-xs hover:bg-[#2A2C30] cursor-pointer"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </section>

          {/* Sticky Order Summary */}
          {cartProducts.length > 0 && (
            <aside className="sticky top-28 rounded-[24px] border border-[#E8E5DC] bg-white p-6 shadow-xs">
              <h2 className="font-display text-[20px] font-bold text-[#121418]">
                Order Summary
              </h2>

              <dl className="mt-6 space-y-3.5 text-[14px] font-sans-ui">
                <div className="flex justify-between text-[#4A4D55]">
                  <dt>Subtotal</dt>
                  <dd className="font-bold text-[#121418]">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-[#4A4D55]">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-[#121418]">
                    {subtotal >= freeShippingThreshold ? "Free" : "EGP 50"}
                  </dd>
                </div>
                <div className="flex justify-between text-[#4A4D55]">
                  <dt>Taxes & VAT</dt>
                  <dd className="font-medium text-[#121418]">Included (14%)</dd>
                </div>
              </dl>

              <div className="my-5 h-px bg-[#E8E5DC]" />

              <div className="flex items-baseline justify-between">
                <span className="font-sans-ui text-[15px] font-bold text-[#121418]">
                  Estimated Total
                </span>
                <span className="font-display text-[24px] font-extrabold text-[#121418]">
                  {formatPrice(subtotal + (subtotal >= freeShippingThreshold ? 0 : 50))}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="btn-tactile mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#121418] text-[14px] font-sans-ui font-bold text-white shadow-xs hover:bg-[#1F4FC7] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[12px] font-sans-ui text-[#6B707B]">
                <ShieldCheck className="size-4 text-[#16A34A]" aria-hidden="true" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}

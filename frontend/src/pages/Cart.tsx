import { Trash2 } from "lucide-react"
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
    <div className="flex h-10 w-[120px] items-center justify-between rounded-[10px] bg-[#f5f7fc] px-[15px]">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="font-['Inter:Bold'] text-[13px] font-bold"
      >
        −
      </button>
      <span
        aria-live="polite"
        className="font-['Inter:Bold'] text-[13px] font-bold"
      >
        {quantity}
      </span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className="font-['Inter:Bold'] text-[13px] font-bold"
      >
        +
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

  return (
    <div className="min-h-dvh bg-white text-[#121f38]">
      <StoreHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-[72px]">
        <section className="mt-[22px]">
          <h1 className="font-['Inter:Bold'] text-[30px] font-bold leading-tight">
            Your cart
          </h1>
          <p className="mt-[7px] font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
            {cartCount} items are waiting for you.
          </p>
        </section>

        <div className="mt-[42px] grid items-start gap-8 lg:grid-cols-[minmax(0,800px)_minmax(340px,448px)] lg:gap-12">
          <section aria-label="Cart items" className="space-y-[30px]">
            {cartProducts.length ? (
              cartProducts.map(({ product, index }) => (
                <article
                  key={product.name}
                  className="relative grid min-h-[160px] gap-4 rounded-[14px] border border-[#e3e8f0] bg-white p-[15px] sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-5 lg:grid-cols-[128px_minmax(0,1fr)_auto]"
                >
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    aria-label={`Remove ${product.name} from cart`}
                    title="Remove from cart"
                    className="absolute top-[15px] right-[15px] flex size-9 items-center justify-center rounded-[9px] text-[#6b7587] transition hover:bg-[#fff0f0] hover:text-[#c43131] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c43131]"
                  >
                    <Trash2 aria-hidden="true" size={18} strokeWidth={1.9} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-[128px] rounded-[10px] object-cover"
                  />

                  <div className="pt-[10px]">
                    <h2 className="font-['Inter:Bold'] text-[17px] font-bold leading-tight">
                      {product.name}
                    </h2>
                    <p className="mt-[12px] font-['Inter:Regular'] text-[13px] font-normal text-[#6b7587]">
                      Standard · In stock
                    </p>
                    <p className="mt-[26px] font-['Inter:Bold'] text-[17px] font-bold">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center sm:col-start-2 sm:row-start-2 lg:col-start-3 lg:row-start-1 lg:mr-[86px] lg:-translate-y-[2px] lg:self-center">
                    <QuantityControl
                      quantity={quantities[index]}
                      onChange={(quantity) => updateQuantity(index, quantity)}
                    />
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[14px] border border-[#e3e8f0] bg-white px-6 py-12 text-center">
                <p className="font-['Inter:Bold'] text-[18px] font-bold">
                  Your cart is empty.
                </p>
                <Link
                  to="/#products"
                  className="mt-3 inline-block font-['Inter:Bold'] text-[14px] font-bold text-[#1f4fc7]"
                >
                  Continue shopping
                </Link>
              </div>
            )}
          </section>

          <aside className="min-h-[390px] rounded-[18px] bg-[#f5f7fc] p-8">
            <h2 className="font-['Inter:Bold'] text-[22px] font-bold leading-tight">
              Order summary
            </h2>

            <dl className="mt-[27px] space-y-[25px]">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
                  Subtotal
                </dt>
                <dd className="font-['Inter:Bold'] text-[14px] font-bold">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
                  Shipping
                </dt>
                <dd className="font-['Inter:Regular'] text-[12px] font-normal text-[#6b7587]">
                  Calculated at checkout
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
                  Discount
                </dt>
                <dd className="font-['Inter:Bold'] text-[14px] font-bold">
                  — EGP 0
                </dd>
              </div>
            </dl>

            <div className="mt-[26px] h-px bg-[#e3e8f0]" />

            <div className="mt-[22px] flex items-center justify-between gap-4">
              <p className="font-['Inter:Bold'] text-[16px] font-bold">
                Estimated total
              </p>
              <p className="font-['Inter:Bold'] text-[20px] font-bold">
                {formatPrice(subtotal)}
              </p>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              disabled={cartCount === 0}
              className="mt-[29px] h-[50px] w-full rounded-[12px] bg-[#1f4fc7] font-['Inter:Bold'] text-[14px] font-bold text-white transition hover:bg-[#173e9f] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9aaad1] disabled:active:scale-100"
            >
              Continue to checkout&nbsp; →
            </button>
            <p className="mt-[13px] font-['Inter:Regular'] text-[12px] font-normal text-[#6b7587]">
              Demo UI only — no real payment is processed.
            </p>
          </aside>
        </div>
      </main>
    </div>
  )
}

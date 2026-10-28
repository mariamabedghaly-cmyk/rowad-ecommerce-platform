import { useState } from "react"
import { Link, useNavigate } from "react-router"

import { formatPrice, useStore } from "../app/store"
import StoreHeader from "../components/StoreHeader"

export default function Product() {
  const [quantity, setQuantity] = useState(1)
  const { addQuantity, products } = useStore()
  const navigate = useNavigate()
  const currentProduct = products[0] || { price: 2499, name: "Studio Wireless Headphones" }

  const addToCart = () => {
    addQuantity(0, quantity)
    navigate("/cart")
  }

  return (
    <div className="min-h-dvh bg-white text-[#121f38]">
      <StoreHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-[72px]">
        <nav
          aria-label="Breadcrumb"
          className="mt-[21px] flex flex-wrap gap-2 font-['Inter:Regular'] text-[13px] font-normal text-[#6b7587]"
        >
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/#products">Electronics</Link>
          <span>/</span>
          <span>Studio Wireless Headphones</span>
        </nav>

        <section
          id="product"
          className="mt-[32px] grid gap-9 lg:grid-cols-[minmax(0,590px)_minmax(0,1fr)] lg:gap-[58px]"
        >
          <img
            src="/assets/6ce96.png"
            alt="Studio Wireless Headphones in midnight black"
            className="aspect-[590/560] w-full rounded-[20px] object-cover lg:h-[560px]"
          />

          <div className="pt-[15px] lg:max-w-[560px]">
            <p className="font-['Inter:Bold'] text-[12px] font-bold text-[#1f4fc7]">
              ELECTRONICS
            </p>
            <h1 className="mt-[17px] font-['Inter:Bold'] text-[36px] font-bold leading-[1.17] tracking-[-0.7px] sm:text-[40px]">
              Studio Wireless
              <br />
              Headphones
            </h1>
            <p className="mt-[14px] font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
              ★ 4.8&nbsp; · &nbsp;128 reviews
            </p>
            <p className="mt-[26px] font-['Inter:Bold'] text-[28px] font-bold leading-none">
              {formatPrice(currentProduct.price)}
            </p>
            <p className="mt-[20px] font-['Inter:Regular'] text-[14px] font-normal text-[#1a7a47]">
              ✓&nbsp; In stock&nbsp; · &nbsp;Free delivery available
            </p>
            <p className="mt-[27px] max-w-[530px] font-['Inter:Regular'] text-[15px] font-normal leading-[1.25] text-[#6b7587]">
              Immersive sound, all-day comfort, and a clean minimal
              <br className="hidden sm:block" /> design made for work, travel,
              and everything between.
            </p>

            <div className="mt-[34px]">
              <p className="font-['Inter:Bold'] text-[14px] font-bold">
                Color: Midnight Black
              </p>
              <button
                aria-label="Midnight Black, selected"
                aria-pressed="true"
                className="mt-[16px] size-9 rounded-full bg-[#121f38] ring-2 ring-transparent ring-offset-2 focus-visible:ring-[#1f4fc7]"
              />
            </div>

            <div className="mt-[30px]">
              <p className="font-['Inter:Bold'] text-[14px] font-bold">
                Quantity
              </p>
              <div className="mt-[13px] flex h-[44px] w-[124px] items-center justify-between rounded-[10px] bg-[#f5f7fc] px-4">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="font-['Inter:Bold'] text-[14px] font-bold"
                >
                  −
                </button>
                <span
                  aria-live="polite"
                  className="font-['Inter:Bold'] text-[14px] font-bold"
                >
                  {quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="font-['Inter:Bold'] text-[14px] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={addToCart}
              className="mt-[22px] h-[52px] w-full max-w-[270px] rounded-[12px] bg-[#1f4fc7] font-['Inter:Bold'] text-[14px] font-bold text-white transition hover:bg-[#173e9f] active:scale-[0.99]"
            >
              Add to cart
            </button>
          </div>
        </section>

        <section className="mt-[65px]">
          <h2 className="font-['Inter:Bold'] text-[22px] font-bold">
            Product details
          </h2>
          <p className="mt-[15px] font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
            Bluetooth 5.3&nbsp; • &nbsp;Up to 35 hours battery&nbsp; •
            &nbsp;USB-C charging&nbsp; • &nbsp;1-year warranty
          </p>
        </section>
      </main>
    </div>
  )
}

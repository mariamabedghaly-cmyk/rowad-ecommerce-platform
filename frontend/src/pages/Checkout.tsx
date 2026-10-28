import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router"

import { formatPrice, useStore } from "../app/store"
import StoreHeader from "../components/StoreHeader"
import { orderApi } from "../api/client"

function Field({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  type?: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label
      htmlFor={id}
      className="block font-['Inter:Regular'] text-[13px] font-normal text-[#6b7587]"
    >
      {label}
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 h-12 w-full rounded-[10px] border border-[#e3e8f0] bg-white px-[15px] font-['Inter:Regular'] text-[14px] font-normal text-[#121f38] outline-none transition placeholder:text-[#6b7587] focus:border-[#1f4fc7] focus:ring-2 focus:ring-[#1f4fc7]/10"
      />
    </label>
  )
}

export default function Checkout() {
  const { cartCount, subtotal, resetCart, products, quantities, user } = useStore()
  const navigate = useNavigate()

  // Form states
  const [email, setEmail] = useState(user?.email || "")
  const [fullName, setFullName] = useState(user?.name || "")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("Cairo")
  const [country, setCountry] = useState("Egypt")
  const [postalCode, setPostalCode] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("CreditCard")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null)

  const handleSubmitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    // Build items from active cart
    const orderItems = products
      .map((product, index) => ({
        product: product.id,
        title: product.name,
        quantity: quantities[index] || 0,
        price: product.price,
      }))
      .filter((item) => item.quantity > 0)

    try {
      // Calls Order Service on Port 5005 (which calls Payment Service on Port 5003)
      const response = await orderApi.createOrder({
        shippingAddress: {
          street,
          city,
          country,
          postalCode,
          fullName,
          phone,
        },
        paymentMethod,
        items: orderItems,
      })

      const orderData = response.order || response
      setConfirmedOrder(orderData)
      resetCart()
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to process order. Ensure backend Order & Payment services are running.",
      )
    } finally {
      setLoading(false)
    }
  }

  // If order confirmed, display the official receipt
  if (confirmedOrder) {
    return (
      <div className="min-h-dvh bg-[#f5f7fc] text-[#121f38]">
        <StoreHeader />
        <main className="mx-auto max-w-[800px] px-5 py-16">
          <div className="rounded-[20px] bg-white p-8 shadow-sm sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="mt-6 font-['Inter:Bold'] text-[28px] font-bold text-[#121f38] sm:text-[32px]">
              Order Confirmed & Paid! 🎉
            </h1>
            <p className="mt-2 text-[14px] text-[#6b7587]">
              Thank you for shopping with Rowad Store. Your payment was approved
              and your order is being processed.
            </p>

            <div className="mt-8 space-y-4 rounded-[12px] bg-[#f8fafc] p-6 text-[14px]">
              <div className="flex justify-between border-b border-[#e3e8f0] pb-3">
                <span className="font-medium text-[#6b7587]">Order Reference:</span>
                <span className="font-bold text-[#121f38]">
                  {confirmedOrder._id || confirmedOrder.id || "ORD-SUCCESS"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#e3e8f0] pb-3">
                <span className="font-medium text-[#6b7587]">Transaction ID:</span>
                <span className="font-mono font-bold text-green-700">
                  {confirmedOrder.transactionId || "TXN-APPROVED"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#e3e8f0] pb-3">
                <span className="font-medium text-[#6b7587]">Payment Status:</span>
                <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-800 uppercase">
                  {confirmedOrder.paymentStatus || "Paid"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#e3e8f0] pb-3">
                <span className="font-medium text-[#6b7587]">Delivery Country:</span>
                <span className="font-bold text-[#121f38]">
                  {confirmedOrder.shippingAddress?.country || country}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#e3e8f0] pb-3">
                <span className="font-medium text-[#6b7587]">Shipping Address:</span>
                <span className="text-right text-[#121f38]">
                  {confirmedOrder.shippingAddress?.street},{" "}
                  {confirmedOrder.shippingAddress?.city}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-[16px] font-bold text-[#121f38]">
                  Total Amount Paid:
                </span>
                <span className="text-[18px] font-bold text-[#1f4fc7]">
                  {formatPrice(confirmedOrder.totalPrice || subtotal)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                to="/"
                className="flex h-12 flex-1 items-center justify-center rounded-[10px] bg-[#1f4fc7] font-['Inter:Bold'] text-[14px] font-bold text-white transition hover:bg-[#173e9f]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (cartCount === 0 && !confirmedOrder) {
    return <Navigate to="/cart" replace />
  }

  return (
    <div className="min-h-dvh bg-white text-[#121f38]">
      <StoreHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-[72px]">
        <section className="mt-[22px]">
          <h1 className="font-['Inter:Bold'] text-[30px] font-bold leading-tight">
            Checkout
          </h1>
          <p className="mt-[7px] font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
            Complete your order with secure payment processing.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-[12px] border border-red-200 bg-red-50 p-4 text-[14px] font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-[50px] grid items-start gap-10 lg:grid-cols-[minmax(0,600px)_minmax(0,608px)] lg:gap-[88px]">
          <form onSubmit={handleSubmitOrder}>
            <section>
              <h2 className="font-['Inter:Bold'] text-[20px] font-bold leading-6">
                1. Contact information
              </h2>
              <div className="mt-5">
                <Field
                  id="email"
                  label="Email address"
                  placeholder="you@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </section>

            <section className="mt-[30px]">
              <h2 className="font-['Inter:Bold'] text-[20px] font-bold leading-6">
                2. Shipping address
              </h2>

              <div className="mt-[18px] grid gap-5 sm:grid-cols-2">
                <Field
                  id="full-name"
                  label="Full name"
                  placeholder="Your full name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Field
                  id="phone"
                  label="Phone number"
                  placeholder="+20 1XX XXX XXXX"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Country Selection Field */}
              <div className="mt-5">
                <label
                  htmlFor="country"
                  className="block font-['Inter:Regular'] text-[13px] font-normal text-[#6b7587]"
                >
                  Country / Region
                  <select
                    id="country"
                    name="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-2 h-12 w-full rounded-[10px] border border-[#e3e8f0] bg-white px-[15px] font-['Inter:Regular'] text-[14px] font-normal text-[#121f38] outline-none transition focus:border-[#1f4fc7] focus:ring-2 focus:ring-[#1f4fc7]/10"
                  >
                    <option value="Egypt">Egypt (جمهورية مصر العربية)</option>
                    <option value="Saudi Arabia">Saudi Arabia (المملكة العربية السعودية)</option>
                    <option value="United Arab Emirates">United Arab Emirates (الإمارات)</option>
                    <option value="Kuwait">Kuwait (الكويت)</option>
                    <option value="Qatar">Qatar (قطر)</option>
                    <option value="Jordan">Jordan (الأردن)</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
              </div>

              <div className="mt-5">
                <Field
                  id="street-address"
                  label="Street address"
                  placeholder="Building, street, apartment"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  id="city"
                  label="City"
                  placeholder="Cairo / Alexandria / Riyadh"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Field
                  id="postal-code"
                  label="Postal code (optional)"
                  placeholder="Postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </section>

            <section className="mt-[30px]">
              <h2 className="font-['Inter:Bold'] text-[20px] font-bold leading-6">
                3. Payment method
              </h2>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 rounded-[10px] border border-[#e3e8f0] p-4 cursor-pointer hover:border-[#1f4fc7]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CreditCard"
                    checked={paymentMethod === "CreditCard"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-[#1f4fc7]"
                  />
                  <div>
                    <p className="text-[14px] font-bold">Credit / Debit Card</p>
                    <p className="text-[12px] text-[#6b7587]">
                      Simulated instant payment via .NET Payment Service
                    </p>
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="mt-[37px] h-[54px] w-full rounded-[12px] bg-[#1f4fc7] font-['Inter:Bold'] text-[14px] font-bold text-white transition hover:bg-[#173e9f] active:scale-[0.99] disabled:opacity-50"
            >
              {loading
                ? "Processing Order & Payment..."
                : `Pay ${formatPrice(subtotal)} & Complete Order`}
            </button>
            <p className="mt-[17px] font-['Inter:Regular'] text-[12px] font-normal text-[#6b7587]">
              Transactions are verified and processed through our microservices architecture.
            </p>
          </form>

          <aside className="min-h-[330px] rounded-[18px] bg-[#f5f7fc] p-8">
            <h2 className="font-['Inter:Bold'] text-[22px] font-bold leading-tight">
              Order summary
            </h2>

            <dl className="mt-[25px] space-y-[25px]">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
                  {cartCount} items
                </dt>
                <dd className="font-['Inter:Bold'] text-[14px] font-bold">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-['Inter:Regular'] text-[14px] font-normal text-[#6b7587]">
                  Shipping
                </dt>
                <dd className="font-['Inter:Regular'] text-[14px] font-normal text-green-700 font-semibold">
                  Free Delivery
                </dd>
              </div>
            </dl>

            <div className="mt-[29px] h-px bg-[#e3e8f0]" />

            <div className="mt-[23px] flex items-center justify-between gap-4">
              <p className="font-['Inter:Bold'] text-[16px] font-bold">
                Estimated total
              </p>
              <p className="font-['Inter:Bold'] text-[20px] font-bold text-[#1f4fc7]">
                {formatPrice(subtotal)}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

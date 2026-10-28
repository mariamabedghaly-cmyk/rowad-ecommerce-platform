import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { ShieldCheck, CheckCircle2, CreditCard, Banknote, Smartphone, Lock, Loader2, Sparkles } from "lucide-react"

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
    <div>
      <label
        htmlFor={id}
        className="block text-[12px] font-sans-ui font-bold text-[#121418] uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-[#C2410C] ml-0.5">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 h-[48px] w-full rounded-[14px] border border-[#E8E5DC] bg-white px-4 font-sans-ui text-[16px] sm:text-[14px] text-[#121418] outline-none transition focus:border-[#1F4FC7] focus:ring-2 focus:ring-[#1F4FC7]/10 placeholder:text-[#6B707B]"
      />
    </div>
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

  const activeOrderItems = products
    .map((product, index) => ({
      product: product.id,
      title: product.name,
      quantity: quantities[index] || 0,
      price: product.price,
      image: product.image,
    }))
    .filter((item) => item.quantity > 0)

  const handleSubmitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const orderItems = activeOrderItems.map((item) => ({
      product: item.product,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    }))

    try {
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

  // Official Receipt Screen on Confirmation
  if (confirmedOrder) {
    return (
      <div className="min-h-dvh bg-[#FAF9F6] text-[#121418]">
        <StoreHeader />
        <main className="mx-auto max-w-[760px] px-5 py-16">
          <div className="rounded-[28px] border border-[#E8E5DC] bg-white p-8 sm:p-12 shadow-xs">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669]">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </div>

            <div className="mt-6 flex items-center gap-2">
              <Sparkles className="size-5 text-[#C2410C]" aria-hidden="true" />
              <span className="font-sans-ui text-[12px] font-bold text-[#C2410C] tracking-wider uppercase">
                Payment Confirmed
              </span>
            </div>

            <h1 className="mt-2 font-display text-[30px] sm:text-[36px] font-extrabold text-[#121418]">
              Order Confirmed & Processed
            </h1>
            <p className="mt-2 text-[14px] font-sans-ui text-[#4A4D55]">
              Thank you for shopping with Rowad Store. Your payment ledger entry was recorded and our fulfillment center is preparing your dispatch.
            </p>

            <div className="mt-8 space-y-3.5 rounded-[20px] border border-[#E8E5DC] bg-[#FAF9F6] p-6 text-[14px] font-sans-ui">
              <div className="flex justify-between border-b border-[#E8E5DC] pb-3">
                <span className="text-[#4A4D55]">Order Reference:</span>
                <span className="font-mono font-bold text-[#121418]">
                  {confirmedOrder._id || confirmedOrder.id || "ORD-SUCCESS"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#E8E5DC] pb-3">
                <span className="text-[#4A4D55]">Payment Transaction:</span>
                <span className="font-mono font-bold text-[#059669]">
                  {confirmedOrder.transactionId || "TXN-APPROVED"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#E8E5DC] pb-3">
                <span className="text-[#4A4D55]">Payment Status:</span>
                <span className="rounded-full bg-[#ECFDF5] px-3 py-0.5 text-[11px] font-bold text-[#059669] uppercase">
                  {confirmedOrder.paymentStatus || "Paid"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#E8E5DC] pb-3">
                <span className="text-[#4A4D55]">Destination:</span>
                <span className="font-medium text-[#121418]">
                  {confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city},{" "}
                  {confirmedOrder.shippingAddress?.country || country}
                </span>
              </div>

              <div className="flex justify-between pt-2 text-[16px]">
                <span className="font-bold text-[#121418]">Total Paid:</span>
                <span className="font-display font-extrabold text-[#121418]">
                  {formatPrice(confirmedOrder.totalPrice || subtotal)}
                </span>
              </div>
            </div>

            <Link
              to="/"
              className="btn-tactile mt-8 flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#121418] text-[14px] font-sans-ui font-bold text-white shadow-xs hover:bg-[#1F4FC7] cursor-pointer"
            >
              Continue Exploring Catalog
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (cartCount === 0 && !confirmedOrder) {
    return <Navigate to="/cart" replace />
  }

  return (
    <div className="min-h-dvh bg-[#FAF9F6] text-[#121418]">
      <StoreHeader />

      <main className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-[72px]">
        <div className="mt-8 border-b border-[#E8E5DC] pb-4">
          <h1 className="font-display text-[32px] sm:text-[40px] font-extrabold tracking-tight text-[#121418]">
            Checkout & Dispatch
          </h1>
          <p className="mt-1 font-sans-ui text-[14px] text-[#4A4D55]">
            Finalize your shipping coordinates and payment method.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-[16px] border border-red-200 bg-red-50 p-4 text-[13px] font-sans-ui text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Checkout Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* 1. Contact Information */}
            <section
              aria-labelledby="contact-heading"
              className="rounded-[24px] border border-[#E8E5DC] bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 id="contact-heading" className="font-display text-[18px] font-bold text-[#121418]">
                1. Contact Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  id="checkout-email"
                  label="Email Address"
                  placeholder="karim@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Field
                  id="checkout-phone"
                  label="Phone (for courier delivery)"
                  placeholder="+20 100 000 0000"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </section>

            {/* 2. Shipping Address */}
            <section
              aria-labelledby="shipping-heading"
              className="rounded-[24px] border border-[#E8E5DC] bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 id="shipping-heading" className="font-display text-[18px] font-bold text-[#121418]">
                2. Shipping Address
              </h2>
              <div className="mt-4 space-y-4">
                <Field
                  id="checkout-full-name"
                  label="Recipient Full Name"
                  placeholder="Karim Mostafa"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <Field
                  id="checkout-street"
                  label="Street Address & Apt"
                  placeholder="15 El Nil Street, Apt 4B, Zamalek"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field
                    id="checkout-city"
                    label="City / Governorate"
                    placeholder="Cairo"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Field
                    id="checkout-country"
                    label="Country"
                    placeholder="Egypt"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <Field
                    id="checkout-postal-code"
                    label="Postal Code"
                    placeholder="11211"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* 3. Payment Method */}
            <section
              aria-labelledby="payment-heading"
              className="rounded-[24px] border border-[#E8E5DC] bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 id="payment-heading" className="font-display text-[18px] font-bold text-[#121418]">
                3. Payment Method
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { id: "CreditCard", label: "Credit Card", icon: CreditCard, desc: "Visa, Mastercard, Mada" },
                  { id: "Instapay", label: "Instapay", icon: Smartphone, desc: "Instant transfer" },
                  { id: "CashOnDelivery", label: "Cash on Delivery", icon: Banknote, desc: "Pay on arrival" },
                ].map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    aria-pressed={paymentMethod === method.id}
                    className={`p-4 rounded-[16px] border text-left transition-all cursor-pointer min-h-[48px] ${
                      paymentMethod === method.id
                        ? "border-[#121418] bg-[#F4F2EC] ring-1 ring-[#121418]"
                        : "border-[#E8E5DC] bg-white hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <method.icon className="size-5 text-[#C2410C]" aria-hidden="true" />
                    <p className="mt-3 font-sans-ui text-[13px] font-bold text-[#121418]">
                      {method.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#4A4D55]">{method.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="btn-tactile flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#121418] text-[15px] font-sans-ui font-bold text-white shadow-xs hover:bg-[#1F4FC7] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Recording Order in Ledger...</span>
                </>
              ) : (
                <>
                  <Lock className="size-4" aria-hidden="true" />
                  <span>Place Order · {formatPrice(subtotal)}</span>
                </>
              )}
            </button>
          </form>

          {/* Sticky Order Review */}
          <aside className="sticky top-28 rounded-[26px] border border-[#E8E5DC] bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="font-display text-[20px] font-bold text-[#121418]">
              Order Summary ({cartCount} {cartCount === 1 ? "item" : "items"})
            </h2>

            <div className="mt-6 divide-y divide-[#E8E5DC]">
              {activeOrderItems.map((item) => (
                <div key={item.title} className="flex items-center gap-3.5 py-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-[10px] bg-[#F4F2EC]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans-ui text-[13px] font-bold text-[#121418] truncate">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-[#4A4D55]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-display text-[14px] font-bold text-[#121418]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#E8E5DC] pt-5 space-y-3 text-[14px] font-sans-ui">
              <div className="flex justify-between text-[#4A4D55]">
                <span>Subtotal</span>
                <span className="font-bold text-[#121418]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4A4D55]">
                <span>Express Courier</span>
                <span className="font-bold text-[#059669]">
                  {subtotal >= 1500 ? "Free" : "EGP 50"}
                </span>
              </div>
            </div>

            <div className="my-5 h-px bg-[#E8E5DC]" />

            <div className="flex items-baseline justify-between">
              <span className="font-sans-ui text-[15px] font-bold text-[#121418]">Total Due</span>
              <span className="font-display text-[24px] font-extrabold text-[#121418]">
                {formatPrice(subtotal + (subtotal >= 1500 ? 0 : 50))}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#FAF9F6] p-3 text-[12px] font-sans-ui text-[#4A4D55]">
              <ShieldCheck className="size-4 text-[#059669]" aria-hidden="true" />
              <span>Direct Bank-Grade Transaction Protection</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

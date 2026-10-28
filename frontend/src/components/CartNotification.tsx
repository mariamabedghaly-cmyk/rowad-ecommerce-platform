import { CheckCircle2, ShoppingBag } from "lucide-react"

type CartNotificationProps = {
  notification: {
    id: number
    message: string
  } | null
}

export default function CartNotification({
  notification,
}: CartNotificationProps) {
  if (!notification) return null

  return (
    <div
      key={notification.id}
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex max-w-[380px] items-center gap-3.5 rounded-full border border-[#E8E5DC] bg-[#121418] px-5 py-3 text-white shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#C2410C] text-white">
        <ShoppingBag className="size-3.5" />
      </span>
      <p className="font-sans-ui text-[13px] font-semibold leading-snug">
        {notification.message}
      </p>
    </div>
  )
}

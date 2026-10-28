import { CheckCircle2 } from "lucide-react"

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
      className="fixed top-5 right-5 z-50 flex max-w-[360px] items-center gap-3 rounded-[14px] border border-[#dce5f4] bg-white px-4 py-3.5 text-[#121f38] shadow-[0_16px_45px_rgba(18,31,56,0.16)]"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eaf7ef] text-[#1a7a47]">
        <CheckCircle2 aria-hidden="true" size={18} strokeWidth={2.2} />
      </span>
      <p className="font-['Inter:Bold'] text-[13px] font-bold leading-5">
        {notification.message}
      </p>
    </div>
  )
}

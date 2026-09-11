import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { useUI } from "../../context/UIContext";

const TONES = {
  success: { icon: CheckCircle2, className: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  error: { icon: AlertTriangle, className: "border-red-200 bg-red-50 text-red-900" },
  info: { icon: Info, className: "border-line bg-white text-ink" },
};

/** Mounted once in AppShell; call `toast()` from anywhere via useUI. */
export default function ToastViewport() {
  const { toasts, dismiss } = useUI();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[70] flex w-[320px] flex-col gap-2 lg:bottom-5" role="region" aria-label="Notifications">
      {toasts.map(({ id, message, tone }) => {
        const { icon: Icon, className } = TONES[tone] ?? TONES.info;
        return (
          <div key={id} role="status" className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[12.5px] shadow-sm ${className}`}>
            <Icon size={15} className="mt-px shrink-0" aria-hidden="true" />
            <span className="flex-1 leading-relaxed">{message}</span>
            <button type="button" onClick={() => dismiss(id)} aria-label="Dismiss" className="rounded p-0.5 hover:bg-black/5">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

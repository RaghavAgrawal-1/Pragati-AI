import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Accessible dark glass dialog modal. */
export default function Modal({ open, onClose, title, children, footer, width = "max-w-lg" }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative w-full ${width} rounded-2xl border border-white/[0.08] bg-[#141520] shadow-[0_24px_60px_rgba(0,0,0,0.7)] outline-none overflow-hidden animate-slideUp`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-[14.5px] font-bold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
        <div className="px-5 py-5 text-ink">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-white/[0.06] px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

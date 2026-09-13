import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useWarnings } from "../../hooks/useWarnings";
import { formatRelative } from "../../utils/formatDate";
import { RISK_LEVELS } from "../../constants/riskLevels";

const SEVERITY_DOT = {
  critical: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

export default function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { warnings } = useWarnings({ limit: 5 });

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const unread = warnings.length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative rounded-xl p-2 text-muted hover:bg-white/[0.06] hover:text-ink transition-colors"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#111318]" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1A1B25] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-slideUp"
        >
          <div className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
            <p className="text-[13px] font-bold text-ink">Recent Early Warnings</p>
            {unread > 0 && (
              <span className="rounded-full bg-orange/10 border border-orange/20 px-2 py-0.5 text-[10px] font-bold text-orange">
                {unread} Active
              </span>
            )}
          </div>

          {warnings.length === 0 ? (
            <p className="px-4 py-6 text-center text-[12.5px] text-muted">No active warnings.</p>
          ) : (
            <div className="max-h-[320px] overflow-y-auto divide-y divide-white/[0.04]">
              {warnings.slice(0, 5).map((w) => (
                <Link
                  key={w.id}
                  to={`/warnings`}
                  onClick={() => setOpen(false)}
                  className="flex gap-2.5 px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[w.severity] ?? "bg-slate-400"}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-semibold text-ink">
                      {w.project_name || w.project || "Infrastructure Project"}
                    </span>
                    <span className="mt-0.5 block line-clamp-2 text-[12px] leading-relaxed text-muted">
                      {w.message || w.rootCause}
                    </span>
                    <span className="mt-1 block text-[10.5px] font-mono text-muted/70">
                      {formatRelative(w.detected_at)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/warnings"
            onClick={() => setOpen(false)}
            className="block border-t border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-center text-[12px] font-bold text-orange hover:bg-white/[0.05] hover:text-orange-light transition-colors"
          >
            View all warnings →
          </Link>
        </div>
      )}
    </div>
  );
}

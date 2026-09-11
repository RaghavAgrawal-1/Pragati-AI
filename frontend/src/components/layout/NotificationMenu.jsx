import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useWarnings } from "../../hooks/useWarnings";
import { formatRelative } from "../../utils/formatDate";
import { RISK_LEVELS } from "../../constants/riskLevels";

/** Severity maps onto the same four-level scale as risk, so the dot reads consistently. */
const SEVERITY_DOT = { critical: RISK_LEVELS.critical.dot, high: RISK_LEVELS.high.dot, medium: RISK_LEVELS.medium.dot, low: RISK_LEVELS.low.dot };

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
        type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}
        className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-ink"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
      >
        <Bell size={18} />
        {unread > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-risk-critical" aria-hidden="true" />}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-[320px] overflow-hidden rounded-lg border border-line bg-white shadow-lg">
          <p className="border-b border-line px-4 py-3 text-[13px] font-medium text-ink">Recent warnings</p>
          {warnings.length === 0 ? (
            <p className="px-4 py-6 text-center text-[12.5px] text-muted">No active warnings.</p>
          ) : (
            warnings.slice(0, 5).map((w) => (
              <Link key={w.id} to={`/warnings/${w.id}`} onClick={() => setOpen(false)} className="flex gap-2.5 border-b border-line/70 px-4 py-3 last:border-0 hover:bg-slate-50">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${SEVERITY_DOT[w.severity] ?? "bg-slate-400"}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium text-ink">{w.project_name}</span>
                  <span className="mt-0.5 block line-clamp-2 text-[12px] leading-snug text-muted">{w.message}</span>
                  <span className="mt-1 block text-[11px] text-slate-400">{formatRelative(w.detected_at)}</span>
                </span>
              </Link>
            ))
          )}
          <Link to="/warnings" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-center text-[12.5px] font-medium text-navy hover:bg-slate-50">
            View all warnings
          </Link>
        </div>
      )}
    </div>
  );
}

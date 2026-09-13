import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Card from "../common/Card";
import Skeleton from "../feedback/Skeleton";

/**
 * `trend` is a signed percentage. `inverted` marks metrics where up is bad
 * (risk counts), so the arrow colour reflects meaning rather than direction.
 */
export default function MetricCard({
  label,
  value,
  trend,
  supporting,
  icon: Icon,
  inverted = false,
  loading,
  onClick,
}) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="h-3 w-20 rounded-full skeleton-dark" />
        <div className="mt-4 h-8 w-24 rounded-full skeleton-dark" />
        <div className="mt-3 h-3 w-28 rounded-full skeleton-dark" />
      </Card>
    );
  }

  const up   = Number(trend) > 0;
  const good = inverted ? !up : up;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const Tag   = onClick ? "button" : "div";

  return (
    <Card
      as={Tag}
      onClick={onClick}
      brackets={true}
      className={`group relative overflow-hidden p-5 text-left transition-all duration-300 ${
        onClick
          ? "cursor-pointer hover:border-orange/30 hover:-translate-y-0.5 active:scale-[0.99]"
          : ""
      }`}
    >
      {/* Subtle orange glow on hover */}
      {onClick && (
        <div aria-hidden="true" className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-orange/[0.08] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted font-sans">
          {label}
        </span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] text-muted border border-white/[0.06] transition-all duration-300 group-hover:scale-110 group-hover:bg-orange/15 group-hover:text-orange group-hover:border-orange/30">
            <Icon size={16} aria-hidden="true" />
          </div>
        )}
      </div>

      <p className="mt-3 text-[26px] font-extrabold tabular-nums leading-none tracking-tight text-ink font-sans animate-countUp">
        {value ?? "—"}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[12px]">
        {trend !== undefined && trend !== null && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold border ${
              good
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            <Arrow size={11} aria-hidden="true" />
            {Math.abs(Number(trend)).toFixed(1)}%
          </span>
        )}
        {supporting && (
          <span className="truncate text-muted text-[11px] font-mono tracking-tight">
            {supporting}
          </span>
        )}
      </div>
    </Card>
  );
}

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
      <Card className="p-6">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="mt-4 h-8 w-24" />
        <Skeleton className="mt-3 h-3 w-28" />
      </Card>
    );
  }

  const up = Number(trend) > 0;
  const good = inverted ? !up : up;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const Tag = onClick ? "button" : "div";

  return (
    <Card
      as={Tag}
      onClick={onClick}
      brackets={true}
      className={`group relative overflow-hidden p-6 text-left transition-all duration-300 ${
        onClick
          ? "cursor-pointer hover:border-amber-500/40 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-8px_rgba(15,23,42,0.12)] active:scale-[0.99]"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-bold uppercase tracking-wider text-slate-500 font-sans">
          {label}
        </span>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100/90 text-slate-600 border border-slate-200/70 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/15 group-hover:text-amber-700 group-hover:border-amber-500/30">
            <Icon size={17} aria-hidden="true" />
          </div>
        )}
      </div>

      <p className="mt-3 text-[28px] font-extrabold tabular-nums leading-none tracking-tight text-ink font-sans">
        {value ?? "—"}
      </p>

      <div className="mt-3.5 flex items-center gap-2 text-[12px]">
        {trend !== undefined && trend !== null && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold border ${
              good
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-700 border-rose-500/20"
            }`}
          >
            <Arrow size={12} aria-hidden="true" />
            {Math.abs(Number(trend)).toFixed(1)}%
          </span>
        )}
        {supporting && (
          <span className="truncate text-slate-500 text-[11.5px] font-mono tracking-tight">
            {supporting}
          </span>
        )}
      </div>
    </Card>
  );
}

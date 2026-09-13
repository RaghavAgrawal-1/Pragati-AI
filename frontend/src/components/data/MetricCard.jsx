import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Card from "../common/Card";
import Skeleton from "../feedback/Skeleton";

/**
 * `trend` is a signed percentage. `inverted` marks metrics where up is bad
 * (risk counts), so the arrow colour reflects meaning rather than direction.
 */
export default function MetricCard({ label, value, trend, supporting, icon: Icon, inverted = false, loading, onClick }) {
  if (loading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-7 w-20" />
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
      className={`group p-5 text-left transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-slate-300 hover:shadow-md active:scale-[0.99]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-[var(--infra-primary-light)] group-hover:text-[var(--infra-primary-dark)]">
            <Icon size={16} aria-hidden="true" />
          </div>
        )}
      </div>

      <p className="mt-2 text-[26px] font-bold tabular-nums leading-none tracking-tight text-ink font-sans">
        {value ?? "—"}
      </p>

      <div className="mt-3 flex items-center gap-2 text-[12px]">
        {trend !== undefined && trend !== null && (
          <span className={`inline-flex items-center gap-0.5 font-bold ${good ? "text-emerald-600" : "text-rose-600"}`}>
            <Arrow size={13} aria-hidden="true" />
            {Math.abs(Number(trend)).toFixed(1)}%
          </span>
        )}
        {supporting && <span className="truncate text-slate-500 text-[11.5px] font-mono">{supporting}</span>}
      </div>
    </Card>
  );
}

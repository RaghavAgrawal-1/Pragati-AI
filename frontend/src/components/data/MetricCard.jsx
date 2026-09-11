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
      className={`p-5 text-left transition-shadow ${onClick ? "hover:shadow-md" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted">{label}</span>
        {Icon && <Icon size={16} className="text-slate-400" aria-hidden="true" />}
      </div>

      <p className="mt-3 text-[26px] font-semibold tabular-nums leading-none tracking-tight text-ink">{value ?? "—"}</p>

      <div className="mt-3 flex items-center gap-2 text-[12px]">
        {trend !== undefined && trend !== null && (
          <span className={`inline-flex items-center gap-0.5 font-medium ${good ? "text-risk-low" : "text-risk-high"}`}>
            <Arrow size={13} aria-hidden="true" />
            {Math.abs(Number(trend)).toFixed(1)}%
          </span>
        )}
        {supporting && <span className="truncate text-muted">{supporting}</span>}
      </div>
    </Card>
  );
}

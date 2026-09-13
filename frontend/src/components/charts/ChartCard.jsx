// Dark ChartCard — dark borders, visible title/subtitle
import Card from "../common/Card";
import Skeleton from "../feedback/Skeleton";
import ErrorState from "../feedback/ErrorState";
import EmptyState from "../feedback/EmptyState";

export default function ChartCard({ title, subtitle, actions, loading, error, onRetry, isEmpty, emptyMessage, height = 260, children }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
        <div>
          <h3 className="text-[13.5px] font-semibold text-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[11.5px] text-muted">{subtitle}</p>}
        </div>
        {actions}
      </div>

      <div className="flex-1 p-4" style={{ minHeight: height }}>
        {loading ? (
          <Skeleton className="h-full w-full rounded-xl" style={{ height }} />
        ) : error ? (
          <ErrorState error={error} onRetry={onRetry} />
        ) : isEmpty ? (
          <EmptyState
            title="Nothing to chart yet."
            description={emptyMessage ?? "This view will populate once the backend returns data."}
          />
        ) : (
          children
        )}
      </div>
    </Card>
  );
}

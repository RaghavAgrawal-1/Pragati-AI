export default function Skeleton({ className = "", style }) {
  return <div className={`rounded skeleton-dark ${className}`} aria-hidden="true" style={style} />;
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-surface-card p-5 ${className}`}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-4 h-7 w-20" />
      <Skeleton className="mt-3 h-3 w-28" />
    </div>
  );
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  );
}

export default function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-slate-200/70 ${className}`} aria-hidden="true" />;
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`rounded-lg border border-line bg-white p-5 ${className}`}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-7 w-20" />
      <Skeleton className="mt-3 h-3 w-32" />
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

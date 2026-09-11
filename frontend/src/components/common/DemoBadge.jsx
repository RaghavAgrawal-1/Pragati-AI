/**
 * Marks figures that came from mock data. Required by the data-honesty rule —
 * demo numbers must never read as real ones.
 */
export default function DemoBadge({ className = "" }) {
  return (
    <span
      title="Placeholder data — this endpoint is not available yet."
      className={`inline-flex items-center rounded border border-amber-300/70 bg-amber-50 px-2 py-0.5
                  text-[10.5px] font-medium uppercase tracking-wide text-amber-700 ${className}`}
    >
      Demo data
    </span>
  );
}

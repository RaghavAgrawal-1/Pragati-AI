import { toPercent } from "../../utils/formatPercentage";

export default function ProgressBar({ value, expected, className = "" }) {
  const pct = toPercent(value) ?? 0;
  const exp = toPercent(expected);

  return (
    <div className={`relative h-1.5 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div
        className="h-full rounded-full bg-navy transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      {/* Expected-progress marker, so the bar shows pace and not just position. */}
      {exp !== null && (
        <span
          className="absolute top-[-2px] h-[10px] w-px bg-slate-500"
          style={{ left: `${Math.min(100, Math.max(0, exp))}%` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

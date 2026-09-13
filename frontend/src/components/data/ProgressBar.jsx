import { toPercent } from "../../utils/formatPercentage";

export default function ProgressBar({ value, expected, className = "" }) {
  const pct = toPercent(value) ?? 0;
  const exp = toPercent(expected);

  return (
    <div className={`relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08] ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#E85418] to-[#FF6B35] transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      {/* Expected-progress marker */}
      {exp !== null && (
        <span
          className="absolute top-[-2px] h-[10px] w-px bg-white/30"
          style={{ left: `${Math.min(100, Math.max(0, exp))}%` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

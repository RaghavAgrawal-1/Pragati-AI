import { toPercent } from "../../utils/formatPercentage";

export default function ProgressCircle({ value, size = 56, stroke = 5, label }) {
  const pct = Math.min(100, Math.max(0, toPercent(value) ?? 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E9F0" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#242E48" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <span className="absolute text-[12px] font-medium tabular-nums text-ink">{label ?? `${Math.round(pct)}%`}</span>
    </span>
  );
}

/**
 * The schedule dial. The inked portion is the share of the portfolio schedule
 * already elapsed, so the ornament carries a real quantity.
 */
function Ticks({ progress }) {
  const cx = 636, cy = 330, count = 74, start = 246, end = 114;
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const a = ((start + (end - start) * t) * Math.PI) / 180;
    const major = i % 6 === 0;
    const r1 = 214, r2 = major ? 252 : 243;
    return (
      <line
        key={i}
        x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
        x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
        stroke={t <= progress ? "rgba(38,48,78,.55)" : "rgba(255,255,255,.75)"}
        strokeWidth={major ? 1.4 : 1} strokeLinecap="round"
      />
    );
  });
}

export default function AuthVisual({ progress = 0.68 }) {
  return (
    <div className="panel-gradient relative order-first h-[150px] overflow-hidden sm:h-[190px] lg:order-none lg:h-auto">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 642" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="636" cy="330" r="206" fill="rgba(255,255,255,.16)" />
        <circle cx="636" cy="330" r="270" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1" />
        <circle cx="636" cy="330" r="330" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
        <Ticks progress={progress} />
        <path d="M60 566 C 150 520, 214 470, 268 386" fill="none" stroke="rgba(255,255,255,.30)" strokeWidth="1" />
        <circle cx="268" cy="386" r="3.5" fill="rgba(255,255,255,.85)" />
      </svg>

      <div className="absolute bottom-8 left-8 hidden max-w-[380px] text-white lg:block lg:bottom-12 lg:left-12">
        <h2 className="text-[30px] font-light leading-[1.15] tracking-tight xl:text-[34px]">
          Monitor projects.<br />Predict{" "}
          <em className="font-serif text-[1.06em] font-medium italic tracking-normal">risks.</em>
        </h2>
        <p className="mt-4 max-w-[34ch] text-[12.5px] leading-relaxed text-white/70">
          AI-powered infrastructure monitoring that flags cost and schedule risk before it becomes irreversible.
        </p>
      </div>
    </div>
  );
}

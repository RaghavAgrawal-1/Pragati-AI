// Dark PageHeader — white title, muted subtitle, orange accent bar, dark border
export default function PageHeader({ title, subtitle, actions, badge, meta }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-5">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-orange shadow-[0_0_8px_rgba(232,84,24,0.6)]" />
          <h2 className="text-[20px] font-extrabold tracking-tight text-ink font-sans">{title}</h2>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1.5 max-w-[75ch] text-[12.5px] leading-relaxed text-muted">{subtitle}</p>
        )}
        {meta && (
          <p className="mt-1 text-[11px] font-mono text-muted/70">{meta}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

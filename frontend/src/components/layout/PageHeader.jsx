export default function PageHeader({ title, subtitle, actions, badge, meta }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="mt-1.5 max-w-[70ch] text-[13px] leading-relaxed text-muted">{subtitle}</p>}
        {meta && <p className="mt-1.5 text-[12px] text-slate-400">{meta}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

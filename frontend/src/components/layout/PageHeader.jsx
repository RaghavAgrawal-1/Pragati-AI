export default function PageHeader({ title, subtitle, actions, badge, meta }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/60 pb-5">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-4 w-1 rounded-full bg-[var(--infra-primary)] shadow-sm" />
          <h2 className="text-[21px] font-bold tracking-tight text-ink font-sans">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="mt-1.5 max-w-[75ch] text-[12.5px] leading-relaxed text-slate-500">{subtitle}</p>}
        {meta && <p className="mt-1.5 text-[11.5px] font-mono text-slate-400">{meta}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

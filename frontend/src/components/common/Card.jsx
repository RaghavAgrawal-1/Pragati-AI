export default function Card({
  children,
  className = "",
  as: Tag = "div",
  brackets = false,
  ...props
}) {
  return (
    <Tag
      className={`rounded-xl border border-slate-200/90 bg-white/95 shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)] hover:border-slate-300/90 transition-all duration-200 ${
        brackets ? "infra-brackets" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, actions, badge }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-[13.5px] font-bold text-ink tracking-tight">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

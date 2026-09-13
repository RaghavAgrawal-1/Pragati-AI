export default function Card({
  children,
  className = "",
  as: Tag = "div",
  brackets = false,
  ...props
}) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_14px_36px_-6px_rgba(15,23,42,0.09)] hover:border-slate-300 transition-all duration-300 ${
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
    <div className="flex items-start justify-between gap-4 border-b border-slate-100/90 px-6 py-4.5">
      <div>
        <div className="flex items-center gap-2.5">
          <h3 className="text-[14px] font-bold text-ink tracking-tight">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

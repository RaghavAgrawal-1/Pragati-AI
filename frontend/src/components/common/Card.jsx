export default function Card({
  children,
  className = "",
  as: Tag = "div",
  brackets = false,
  ...props
}) {
  return (
    <Tag
      className={`rounded-2xl border border-white/[0.06] bg-surface-card shadow-card hover:shadow-card-hover hover:border-white/[0.1] transition-all duration-300 ${
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
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-4">
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

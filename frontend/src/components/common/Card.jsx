export default function Card({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag className={`rounded-lg border border-line bg-white ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <h3 className="text-[14px] font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

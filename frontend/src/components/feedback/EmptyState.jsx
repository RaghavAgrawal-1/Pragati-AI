import Button from "../common/Button";

export default function EmptyState({ title, description, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {Icon && <Icon size={22} className="mb-3 text-slate-400" aria-hidden="true" />}
      <p className="text-[14px] font-medium text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-muted">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

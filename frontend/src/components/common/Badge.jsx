export default function Badge({ children, className = "", dot }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11.5px] font-medium ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />}
      {children}
    </span>
  );
}

/** CSS-only tooltip — no positioning library for a label this small. */
export default function Tooltip({ label, children, className = "" }) {
  return (
    <span className={`group relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap
                   rounded bg-slateink px-2 py-1 text-[11px] text-white opacity-0 transition-opacity
                   group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

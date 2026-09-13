// Dark-mode Button — primary uses orange, secondary uses dark glass
const VARIANTS = {
  primary:       "bg-orange text-white hover:bg-orange-light border border-orange/40 shadow-submit disabled:bg-orange/40 disabled:border-orange/20",
  secondary:     "border border-white/[0.1] bg-white/[0.06] text-ink hover:bg-white/[0.1] hover:border-white/[0.16]",
  danger:        "bg-red-600 text-white hover:bg-red-500 border border-red-500/40 shadow-sm",
  ghost:         "text-muted hover:bg-white/[0.06] hover:text-ink",
  infra:         "bg-[var(--infra-primary)] text-white font-bold hover:brightness-105 shadow-[0_2px_10px_-2px_var(--infra-glow)]",
  "infra-outline":"border border-[var(--infra-primary)] text-[var(--infra-primary)] hover:bg-[var(--infra-primary-light)] font-semibold",
};

const SIZES = {
  sm: "h-8 px-3 text-[11.5px]",
  md: "h-9 px-3.5 text-[12.5px]",
  lg: "h-10 px-4.5 text-[13.5px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 active:scale-[0.98]
                  disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={14} aria-hidden="true" />}
      {children}
    </button>
  );
}

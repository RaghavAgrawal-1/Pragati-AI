const VARIANTS = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700/40 shadow-sm disabled:bg-slate-300",
  secondary: "border border-slate-200 bg-white text-ink hover:bg-slate-50 hover:border-slate-300 shadow-sm",
  danger: "bg-risk-critical text-white hover:brightness-110 shadow-sm",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink",
  infra: "bg-[var(--infra-primary)] text-slate-950 font-bold hover:brightness-105 shadow-[0_2px_10px_-2px_var(--infra-glow)]",
  "infra-outline": "border border-[var(--infra-primary)] text-slate-800 hover:bg-[var(--infra-primary-light)] font-semibold",
};

const SIZES = {
  sm: "h-8 px-3 text-[12px]",
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 active:scale-[0.98]
                  disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
}

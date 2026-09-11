const VARIANTS = {
  primary: "bg-navy text-white hover:bg-navy-soft disabled:bg-slate-300",
  secondary: "border border-line bg-white text-ink hover:bg-slate-50",
  danger: "bg-risk-critical text-white hover:brightness-110",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-ink",
};

const SIZES = { sm: "h-8 px-3 text-[12.5px]", md: "h-10 px-4 text-[13px]", lg: "h-11 px-5 text-[13.5px]" };

export default function Button({ variant = "primary", size = "md", icon: Icon, children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors
                  disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
}

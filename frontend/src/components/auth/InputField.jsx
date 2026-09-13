// Dark auth InputField — dark glass input, visible label and text
export default function InputField({ id, label, type = "text", value, onChange, onBlur, error, placeholder, autoComplete, trailing, ...rest }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
          aria-invalid={!!error} aria-describedby={error ? `${id}-msg` : undefined}
          className={`h-[46px] w-full rounded-xl border bg-white/[0.04] px-4 text-[13.5px] text-ink outline-none
            transition-all placeholder:text-muted/50
            ${trailing ? "pr-[52px]" : ""}
            ${error
              ? "border-red-500/40 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-white/[0.08] hover:border-white/[0.14] focus:border-orange/60 focus:ring-2 focus:ring-orange/20"
            }`}
          style={{ color: '#F0F2F8' }}
          {...rest}
        />
        {trailing}
      </div>
      {error && <p id={`${id}-msg`} className="mt-1.5 text-[11.5px] text-red-400">{error}</p>}
    </div>
  );
}

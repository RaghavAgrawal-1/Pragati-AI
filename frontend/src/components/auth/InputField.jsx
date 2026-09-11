export default function InputField({ id, label, type = "text", value, onChange, onBlur, error, placeholder, autoComplete, trailing, ...rest }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-[#3A4254]">{label}</label>
      <div className="relative">
        <input
          id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
          aria-invalid={!!error} aria-describedby={error ? `${id}-msg` : undefined}
          className={`h-[48px] w-full rounded-field border bg-[#FBFBFD] px-4 text-sm text-ink outline-none
            transition-all placeholder:text-[#A7ADBD] focus:bg-white focus:ring-4 ${trailing ? "pr-[52px]" : ""}
            ${error ? "border-danger/50 bg-[#FEFBFB] focus:border-danger/60 focus:ring-danger/10"
                    : "border-line hover:border-[#DCDEE9] focus:border-peri focus:ring-peri/15"}`}
          {...rest}
        />
        {trailing}
      </div>
      {error && <p id={`${id}-msg`} className="mt-1.5 text-[11.5px] text-danger">{error}</p>}
    </div>
  );
}

export default function Input({
  label,
  error,
  icon: Icon,
  className = "",
  containerClassName = "",
  required,
  id,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#14142B]"
        >
          {label} {required && <span className="text-[#E11D48]">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          id={inputId}
          required={required}
          className={`h-11 w-full rounded-xl border bg-[#F8FAFC] px-3.5 text-sm text-[#14142B] placeholder:text-[#94A3B8] transition-all duration-150 hover:border-slate-400 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4F46E5]/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:hover:border-[#CBD5E1] ${
            Icon ? "pl-10" : ""
          } ${
            error ? "border-[#E11D48] focus:ring-[#E11D48]/15" : "border-[#CBD5E1]"
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-[#E11D48]">{error}</p>}
    </div>
  );
}
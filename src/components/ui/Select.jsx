export default function Select({ label, error, options = [], placeholder = "Select", className = "", containerClassName = "", ...props }) {
  return (
    <div className={containerClassName}>
      {label && <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>}
      <select
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
          error ? "border-danger" : "border-slate-300"
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

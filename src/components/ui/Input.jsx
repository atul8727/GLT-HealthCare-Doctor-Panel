export default function Input({ label, error, className = "", containerClassName = "", ...props }) {
  return (
    <div className={containerClassName}>
      {label && <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>}
      <input
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
          error ? "border-danger" : "border-slate-300"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}

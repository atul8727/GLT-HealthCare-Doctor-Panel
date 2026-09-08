const styles = {
  primary: "bg-primary-light text-primary",
  success: "bg-green-100 text-success",
  warning: "bg-amber-100 text-warning",
  danger: "bg-red-100 text-danger",
  rose: "bg-rose-100 text-rose-600",
  neutral: "bg-slate-100 text-muted",
};

export default function Badge({ children, color = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[color]} ${className}`}
    >
      {children}
    </span>
  );
}

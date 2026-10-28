/**
 * <Card /> — white rounded card.
 * Existing usage (children + className + padding) is unchanged.
 * Optional: title / icon / action render an admin-style header row.
 */
export default function Card({
  children,
  className = "",
  padding = "p-5",
  title,
  icon: Icon,
  action,
}) {
  const base =
    "rounded-[20px] border border-[#E2E8F0] bg-white shadow-card transition-all";

  if (title || action) {
    return (
      <div className={`${base} ${className}`}>
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5] shadow-xs">
                <Icon className="h-5 w-5" />
              </span>
            )}
            {title && <h3 className="truncate text-base font-bold text-[#14142B]">{title}</h3>}
          </div>
          {action}
        </div>
        <div className={padding}>{children}</div>
      </div>
    );
  }

  return <div className={`${base} ${padding} ${className}`}>{children}</div>;
}
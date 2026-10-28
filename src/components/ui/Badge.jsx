const styles = {
  primary: "bg-[#EEF2FF] text-[#4F46E5]",
  info: "bg-[#E0F2FE] text-[#0369A1]",
  success: "bg-[#DCFCE7] text-[#15803D]",
  warning: "bg-[#FEF3C7] text-[#B45309]",
  danger: "bg-[#FFE4E6] text-[#BE123C]",
  rose: "bg-[#FFE4E6] text-[#E11D48]",
  neutral: "bg-slate-100 text-slate-600",
};

export default function Badge({ children, color = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex select-none items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold leading-none tracking-wide ${
        styles[color] || styles.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}
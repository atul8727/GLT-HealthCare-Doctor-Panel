export default function Card({ children, className = "", padding = "p-5" }) {
  return (
    <div className={`bg-card rounded-xl shadow-card border border-slate-100 ${padding} ${className}`}>
      {children}
    </div>
  );
}

export default function WelcomeHeader({ title, subtitle }) {
  return (
    <div className="mb-1">
      <h1 className="text-xl font-bold text-navy">{title}</h1>
      {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
    </div>
  );
}

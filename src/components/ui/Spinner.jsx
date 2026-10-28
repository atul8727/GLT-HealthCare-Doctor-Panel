export default function Spinner({ size = 24, className = "" }) {
  return (
    <div
      className={`animate-spin rounded-full border-[3px] border-indigo-100 border-t-[#4F46E5] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
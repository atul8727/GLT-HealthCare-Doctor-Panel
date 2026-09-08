import { FiSun, FiSunrise, FiMoon } from "react-icons/fi";

function timeOfDayIcon() {
  const h = new Date().getHours();
  if (h < 12) return FiSunrise;
  if (h < 17) return FiSun;
  return FiMoon;
}

export default function WelcomeHeader({ title, subtitle }) {
  const Icon = timeOfDayIcon();
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white px-6 py-5 mb-1 shadow-card">
      <div className="absolute -right-6 -top-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute right-16 -bottom-12 w-28 h-28 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

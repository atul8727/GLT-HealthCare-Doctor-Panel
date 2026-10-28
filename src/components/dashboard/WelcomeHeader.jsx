import { FiSun, FiSunrise, FiMoon } from "react-icons/fi";

export default function WelcomeHeader({ title, subtitle }) {
  const h = new Date().getHours();
  const Icon = h < 12 ? FiSunrise : h < 17 ? FiSun : FiMoon;

  return (
    <div className="relative mb-1 overflow-hidden rounded-[20px] bg-gradient-to-r from-[#0F172A] via-[#2358D6] to-[#0EA5E9] px-5 py-5 text-white shadow-[0_12px_28px_rgba(35,88,214,0.25)] sm:px-7 sm:py-6">
      <div className="pointer-events-none absolute -right-6 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-sm text-white/85 sm:text-base">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
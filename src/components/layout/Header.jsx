import { useState } from "react";
import { FiMenu, FiSearch, FiBell } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";

const NOTIFICATIONS = [
  "New consultation assigned",
  "Upcoming consultation in 30 minutes",
  "Consultation rescheduled",
  "Prescription generated successfully",
];

export default function Header({ onMenuClick, title }) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const shortName = user?.name?.split(" ").slice(0, 2).join(" ") || "Doctor";

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden text-navy p-1.5 -ml-1.5">
          <FiMenu size={22} />
        </button>
        <div className="min-w-0">
          <p className="font-semibold text-navy text-sm lg:text-base truncate">
            {title || `${greeting}, ${shortName}`}
          </p>
          <p className="text-xs text-muted hidden sm:block">{formatDate("2026-09-03", "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-sm">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 rounded-full hover:bg-slate-100 text-navy"
          >
            <FiBell size={19} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-72 bg-card border border-slate-200 rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 font-medium text-sm">Notifications</div>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} className="px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-50 last:border-0 cursor-pointer">
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-sm">
            {(user?.name || "D").split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-navy">{user?.name}</p>
            <p className="text-xs text-muted">{user?.specialization}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

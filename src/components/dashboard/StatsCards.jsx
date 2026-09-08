import { FiCalendar, FiClock, FiCheckCircle, FiUsers } from "react-icons/fi";

const CARDS = [
  {
    key: "todaysConsultations",
    label: "Today's Consultations",
    icon: FiCalendar,
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    accent: "before:bg-sky-500",
  },
  {
    key: "upcomingConsultations",
    label: "Upcoming Consultations",
    icon: FiClock,
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    accent: "before:bg-amber-500",
  },
  {
    key: "completedConsultations",
    label: "Completed Consultations",
    icon: FiCheckCircle,
    iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
    accent: "before:bg-emerald-500",
  },
  {
    key: "myPatients",
    label: "My Patients",
    icon: FiUsers,
    iconBg: "bg-gradient-to-br from-violet-500 to-indigo-600",
    accent: "before:bg-violet-500",
  },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={`relative overflow-hidden bg-card rounded-xl shadow-card border border-slate-100 p-5 flex items-center gap-4
              before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${c.accent}
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm ${c.iconBg}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy leading-none">
                {loading ? "—" : stats?.[c.key] ?? 0}
              </p>
              <p className="text-xs text-muted mt-1.5">{c.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

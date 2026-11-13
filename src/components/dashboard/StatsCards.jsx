import { FiCalendar, FiClock, FiCheckCircle, FiUsers } from "react-icons/fi";

const CARDS = [
  {
    key: "todaysConsultations",
    label: "Today's Consultations",
    icon: FiCalendar,
    gradient: "from-[#0EA5E9] via-[#0A93CF] to-[#0877B5]",
    shadow: "shadow-[0_12px_28px_rgba(14,165,233,0.32)] hover:shadow-[0_16px_34px_rgba(14,165,233,0.42)]",
  },
  {
    key: "upcomingConsultations",
    label: "Upcoming Consultations",
    icon: FiClock,
    gradient: "from-[#FBA919] via-[#F58A0B] to-[#EA580C]",
    shadow: "shadow-[0_12px_28px_rgba(245,138,11,0.34)] hover:shadow-[0_16px_34px_rgba(245,138,11,0.44)]",
  },
  {
    key: "completedConsultations",
    label: "Completed Consultations",
    icon: FiCheckCircle,
    gradient: "from-[#10B981] via-[#0FA77D] to-[#0B8F73]",
    shadow: "shadow-[0_12px_28px_rgba(16,185,129,0.32)] hover:shadow-[0_16px_34px_rgba(16,185,129,0.42)]",
  },
  {
    key: "myPatients",
    label: "My Patients",
    icon: FiUsers,
    gradient: "from-[#3B6CF5] via-[#4F5FEA] to-[#6D4FE0]",
    shadow: "shadow-[0_12px_28px_rgba(79,95,234,0.35)] hover:shadow-[0_16px_34px_rgba(79,95,234,0.45)]",
  },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={`group relative overflow-hidden rounded-[22px] bg-gradient-to-br ${c.gradient} ${c.shadow} p-5 text-white ring-1 ring-inset ring-white/20 transition-all duration-300 hover:-translate-y-1`}
          >
            <span className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-110" />
            <span className="pointer-events-none absolute -bottom-14 right-14 h-32 w-32 rounded-full bg-white/[0.07]" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-wide text-white/90">{c.label}</p>
                <p className="mt-3 text-4xl font-extrabold leading-none tracking-tight drop-shadow-sm">
                  {loading ? "—" : stats?.[c.key] ?? 0}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
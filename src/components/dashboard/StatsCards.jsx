import Card from "../ui/Card";
import { FiCalendar, FiClock, FiCheckCircle, FiUsers } from "react-icons/fi";

const CARDS = [
  { key: "todaysConsultations", label: "Today's Consultations", icon: FiCalendar, color: "text-primary bg-primary-light" },
  { key: "upcomingConsultations", label: "Upcoming Consultations", icon: FiClock, color: "text-warning bg-amber-100" },
  { key: "completedConsultations", label: "Completed Consultations", icon: FiCheckCircle, color: "text-success bg-green-100" },
  { key: "myPatients", label: "My Patients", icon: FiUsers, color: "text-indigo-600 bg-indigo-100" },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.key} className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy leading-none">
                {loading ? "—" : stats?.[c.key] ?? 0}
              </p>
              <p className="text-xs text-muted mt-1.5">{c.label}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

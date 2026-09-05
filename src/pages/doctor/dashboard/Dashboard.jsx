import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dashboardService } from "../../../services/dashboard/dashboardService";
import WelcomeHeader from "../../../components/dashboard/WelcomeHeader";
import StatsCards from "../../../components/dashboard/StatsCards";
import UpcomingConsultation from "../../../components/dashboard/UpcomingConsultation";
import TodayConsultations from "../../../components/dashboard/TodayConsultations";
import RecentPatients from "../../../components/dashboard/RecentPatients";
import { useAuth } from "../../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [todays, setTodays] = useState([]);
  const [next, setNext] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [s, t, n, r] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTodaysConsultations(),
        dashboardService.getNextConsultation(),
        dashboardService.getRecentPatients(),
      ]);
      setStats(s);
      setTodays(t);
      setNext(n);
      setRecentPatients(r);
      setLoading(false);
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <WelcomeHeader
        title={`Good Morning, ${user?.name || "Doctor"}`}
        subtitle="Here's what's happening with your patients today."
      />

      <StatsCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <TodayConsultations consultations={todays} loading={loading} />
        </div>
        <div className="space-y-5">
          <UpcomingConsultation consultation={next} loading={loading} />
          <RecentPatients patients={recentPatients} loading={loading} />
        </div>
      </div>
    </motion.div>
  );
}

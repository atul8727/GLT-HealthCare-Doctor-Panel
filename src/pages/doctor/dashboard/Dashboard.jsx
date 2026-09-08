import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dashboardService } from "../../../services/dashboard/dashboardService";
import WelcomeHeader from "../../../components/dashboard/WelcomeHeader";
import StatsCards from "../../../components/dashboard/StatsCards";
import UpcomingConsultation from "../../../components/dashboard/UpcomingConsultation";
import TodayConsultations from "../../../components/dashboard/TodayConsultations";
import RecentPatients from "../../../components/dashboard/RecentPatients";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import { friendlyError } from "../../../utils/errorMessage";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [todays, setTodays] = useState([]);
  const [next, setNext] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      // Promise.allSettled — agar ek call fail ho (jaise 403), to baaki
      // widgets phir bhi apna data dikha sakte hain, poora dashboard
      // blank nahi hoga.
      const [s, t, n, r] = await Promise.allSettled([
        dashboardService.getStats(),
        dashboardService.getTodaysConsultations(),
        dashboardService.getNextConsultation(),
        dashboardService.getRecentPatients(),
      ]);

      if (s.status === "fulfilled") setStats(s.value);
      if (t.status === "fulfilled") setTodays(t.value);
      if (n.status === "fulfilled") setNext(n.value);
      if (r.status === "fulfilled") setRecentPatients(r.value);

      const firstError = [s, t, n, r].find((x) => x.status === "rejected")?.reason;
      if (firstError) setError(friendlyError(firstError));

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
        title={`${greeting()}, ${user?.name || "Doctor"}`}
        subtitle="Here's what's happening with your patients today."
      />

      {error && (
        <Card>
          <EmptyState icon={FiAlertTriangle} title="Kuch data load nahi ho paya" subtitle={error} />
        </Card>
      )}

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

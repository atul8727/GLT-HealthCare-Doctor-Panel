import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Tabs from "../../../components/ui/Tabs";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/common/StatusBadge";
import { formatDate } from "../../../utils/formatDate";
import { friendlyError } from "../../../utils/errorMessage";
import { avatarColor, initialsOf } from "../../../utils/avatarColor";
import { FiAlertTriangle, FiVideo, FiEye } from "react-icons/fi";

const FILTERS = ["All", "Today's", "Upcoming", "Completed", "Cancelled"];

export default function Consultations() {
  const [filter, setFilter] = useState("All");
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await consultationService.getConsultations(filter);
        setConsultations(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">Consultations</h1>
        <p className="text-sm text-muted mt-1">All your scheduled and past consultations.</p>
      </div>

      <Tabs tabs={FILTERS} active={filter} onChange={setFilter} />

      <Card>
        {loading ? (
          <div className="flex justify-center py-14"><Spinner /></div>
        ) : error ? (
          <EmptyState
            icon={error.status === 403 ? undefined : FiAlertTriangle}
            title={error.status === 403 ? "Permission denied" : "Failed to load"}
            subtitle={friendlyError(error)}
          />
        ) : consultations.length === 0 ? (
          <EmptyState icon={FiCalendar} title="No consultations found" />
        ) : (
          <Table columns={["Patient", "Date", "Time", "Type", "Status", "Action"]}>
            {consultations.map((c) => (
              <tr key={c.id}>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm ${avatarColor(c.patientId)}`}>
                      {initialsOf(c.patient?.name)}
                    </div>
                    <span className="font-medium text-navy">{c.patient?.name || "—"}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{formatDate(c.date)}</td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{c.time}</td>
                <td className="py-3 pr-4">
                  <Badge color={c.type === "Online" ? "primary" : "neutral"}>{c.type}</Badge>
                </td>
                <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
                <td className="py-3 pr-4">
                  <Link to={`/doctor/consultations/${c.id}`}>
                    <Button size="sm" variant={c.status === "Scheduled" ? "primary" : "secondary"} icon={c.status === "Scheduled" ? FiVideo : FiEye}>
                      {c.status === "Completed" ? "View" : c.status === "Scheduled" ? "Open" : "View"}
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </motion.div>
  );
}

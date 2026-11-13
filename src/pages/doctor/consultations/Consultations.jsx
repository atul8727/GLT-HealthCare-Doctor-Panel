import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiAlertTriangle, FiVideo, FiEye } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Tabs from "../../../components/ui/Tabs";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import Avatar from "../../../components/ui/Avatar";
import StatusBadge from "../../../components/common/StatusBadge";
import { formatDate } from "../../../utils/formatDate";
import { friendlyError } from "../../../utils/errorMessage";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-[#14142B]">Consultations</h1>
        <p className="mt-1 text-sm text-[#64748B]">All your scheduled and past consultations.</p>
      </div>

      <Tabs tabs={FILTERS} active={filter} onChange={setFilter} />

      <Card padding="p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
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
              <tr key={c.id} className="transition-colors hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.patient?.name} id={c.patientId} size="sm" />
                    <span className="font-bold text-[#14142B]">{c.patient?.name || "—"}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#64748B]">
                  {formatDate(c.date)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#14142B]">
                  {c.time}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <Badge color={c.type === "Online" ? "primary" : "neutral"}>
                    {c.type}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <Link to={`/doctor/consultations/${c.id}`}>
                    <Button
                      size="sm"
                      variant={c.status === "Scheduled" ? "primary" : "actionView"}
                      icon={c.status === "Scheduled" ? FiVideo : FiEye}
                    >
                      {c.status === "Scheduled" ? "Join" : "View"}
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Tabs from "../../../components/ui/Tabs";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/common/StatusBadge";
import { formatDate } from "../../../utils/formatDate";
import { friendlyError } from "../../../utils/errorMessage";
import { FiAlertTriangle } from "react-icons/fi";

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
            title={error.status === 403 ? "Permission denied" : "Load nahi ho paya"}
            subtitle={friendlyError(error)}
          />
        ) : consultations.length === 0 ? (
          <EmptyState icon={FiCalendar} title="No consultations found" />
        ) : (
          <Table columns={["Patient", "Date", "Time", "Type", "Status", "Action"]}>
            {consultations.map((c) => (
              <tr key={c.id}>
                <td className="py-3 pr-4 font-medium text-navy whitespace-nowrap">{c.patient?.name}</td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{formatDate(c.date)}</td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{c.time}</td>
                <td className="py-3 pr-4 text-muted">{c.type}</td>
                <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
                <td className="py-3 pr-4">
                  <Link to={`/doctor/consultations/${c.id}`}>
                    <Button size="sm" variant="outline">
                      {c.status === "Completed" ? "View" : "Open"}
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

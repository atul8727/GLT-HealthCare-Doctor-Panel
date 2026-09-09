import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClipboard, FiAlertTriangle, FiEye } from "react-icons/fi";
import { patientService } from "../../../services/patients/patientService";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import Spinner from "../../../components/ui/Spinner";
import { formatDate } from "../../../utils/formatDate";
import { friendlyError } from "../../../utils/errorMessage";
import { avatarColor, initialsOf } from "../../../utils/avatarColor";

// There is no dedicated "list all prescriptions" endpoint on the backend —
// prescriptions can only be fetched per-patient or per-consultation. So here
// we take all of this doctor's patients, fetch each patient's prescriptions,
// and build one combined list. If fetching for one patient fails, the whole
// list doesn't crash.
export default function Prescriptions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const patients = await patientService.getPatients();
        const results = await Promise.all(
          patients.map(async (p) => {
            try {
              const rx = await prescriptionService.getPatientPrescriptions(p.id);
              return rx.map((r) => ({ ...r, patient: p }));
            } catch {
              return [];
            }
          })
        );
        const flat = results.flat().sort((a, b) => new Date(b.date) - new Date(a.date));
        setList(flat);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">Prescriptions</h1>
        <p className="text-sm text-muted mt-1">All prescriptions you've generated.</p>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-14"><Spinner /></div>
        ) : error ? (
          <EmptyState
            icon={error.status === 403 ? undefined : FiAlertTriangle}
            title={error.status === 403 ? "Permission denied" : "Failed to load"}
            subtitle={friendlyError(error)}
          />
        ) : list.length === 0 ? (
          <EmptyState icon={FiClipboard} title="No prescriptions yet" />
        ) : (
          <Table columns={["Patient", "Date", "Medicines", "Follow-up", "Action"]}>
            {list.map((rx) => (
              <tr key={rx.id}>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm ${avatarColor(rx.patient?.id)}`}>
                      {initialsOf(rx.patient?.name)}
                    </div>
                    <span className="text-navy">{rx.patient?.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{formatDate(rx.date)}</td>
                <td className="py-3 pr-4">
                  <Badge color="primary">{rx.medicines?.length || 0} medicine(s)</Badge>
                </td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{rx.followUpDate ? formatDate(rx.followUpDate) : "—"}</td>
                <td className="py-3 pr-4">
                  <Link to={`/doctor/prescriptions/${rx.id}`}>
                    <Button size="sm" variant="secondary" icon={FiEye}>View</Button>
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFileText, FiAlertTriangle } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import Spinner from "../../../components/ui/Spinner";
import { formatDate } from "../../../utils/formatDate";
import { friendlyError } from "../../../utils/errorMessage";

export default function PatientHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // consultationService.getConsultations already patient object
        // ke saath enrich karke deta hai (agar backend embed na kare
        // to bhi best-effort fetch karta hai), isliye alag se
        // getPatients() call karne ki zaroorat nahi.
        const all = await consultationService.getConsultations("Completed");
        const merged = all.map((c) => ({ ...c, patientName: c.patient?.name || "—" }));
        setRecords(merged);
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
        <h1 className="text-xl font-bold text-navy">Patient History</h1>
        <p className="text-sm text-muted mt-1">Centralized view of previous consultation records.</p>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-14"><Spinner /></div>
        ) : error ? (
          <EmptyState
            icon={error.status === 403 ? undefined : FiAlertTriangle}
            title={error.status === 403 ? "Permission denied" : "Load nahi ho paya"}
            subtitle={friendlyError(error)}
          />
        ) : records.length === 0 ? (
          <EmptyState icon={FiFileText} title="No past records found" />
        ) : (
          <Table columns={["Patient", "Consultation Date", "Diagnosis", "Prescription", "Action"]}>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="py-3 pr-4 font-medium text-navy whitespace-nowrap">{r.patientName}</td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{formatDate(r.date)}</td>
                <td className="py-3 pr-4 text-muted">{r.diagnosis || "—"}</td>
                <td className="py-3 pr-4 text-muted">
                  <Link to="/doctor/prescriptions" className="text-primary hover:underline">
                    View
                  </Link>
                </td>
                <td className="py-3 pr-4">
                  <Link to={`/doctor/consultations/${r.id}`}>
                    <Button size="sm" variant="outline">Open</Button>
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

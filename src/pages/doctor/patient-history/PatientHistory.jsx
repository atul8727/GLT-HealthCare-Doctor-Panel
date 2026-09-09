import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFileText, FiAlertTriangle, FiEye } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
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

export default function PatientHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // consultationService.getConsultations already enriches with the
        // patient object (falling back to a best-effort fetch if the
        // backend doesn't embed it), so there's no need for a separate
        // getPatients() call here.
        const all = await consultationService.getConsultations("Completed");
        // Fetch each consultation's actual prescription (if one exists) too,
        // so the "Prescription" column shows the right thing — previously
        // this always linked to a generic list.
        const merged = await Promise.all(
          all.map(async (c) => {
            const rx = await prescriptionService.getConsultationPrescription(c.id).catch(() => null);
            return { ...c, patientName: c.patient?.name || "—", prescription: rx };
          })
        );
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
            title={error.status === 403 ? "Permission denied" : "Failed to load"}
            subtitle={friendlyError(error)}
          />
        ) : records.length === 0 ? (
          <EmptyState icon={FiFileText} title="No past records found" />
        ) : (
          <Table columns={["Patient", "Consultation Date", "Diagnosis", "Prescription", "Action"]}>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm ${avatarColor(r.patientId)}`}>
                      {initialsOf(r.patientName)}
                    </div>
                    <span className="font-medium text-navy">{r.patientName}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{formatDate(r.date)}</td>
                <td className="py-3 pr-4 text-muted">{r.diagnosis || "—"}</td>
                <td className="py-3 pr-4">
                  {r.prescription ? (
                    <Link to={`/doctor/prescriptions/${r.prescription.id}`}>
                      <Badge color="success">Available</Badge>
                    </Link>
                  ) : (
                    <Badge color="neutral">Not created</Badge>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <Link to={`/doctor/consultations/${r.id}`}>
                    <Button size="sm" variant="secondary" icon={FiEye}>Open</Button>
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

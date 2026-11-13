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
import Avatar from "../../../components/ui/Avatar";
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
        const all = await consultationService.getConsultations("Completed");
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-[#14142B]">Patient History</h1>
        <p className="mt-1 text-sm text-[#64748B]">Centralized view of previous consultation records.</p>
      </div>

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
        ) : records.length === 0 ? (
          <EmptyState icon={FiFileText} title="No past records found" />
        ) : (
          <Table columns={["Patient", "Consultation Date", "Diagnosis", "Prescription", "Action"]}>
            {records.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.patientName} id={r.patientId} size="sm" />
                    <span className="font-bold text-[#14142B]">{r.patientName}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#64748B]">
                  {formatDate(r.date)}
                </td>
                <td className="max-w-xs truncate px-5 py-4 text-sm font-medium text-[#14142B]">
                  {r.diagnosis || "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {r.prescription ? (
                    <Link to={`/doctor/prescriptions/${r.prescription.id}`}>
                      <Badge color="success">Available</Badge>
                    </Link>
                  ) : (
                    <Badge color="neutral">Not created</Badge>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <Link to={`/doctor/consultations/${r.id}`}>
                    <Button size="sm" variant="actionView" icon={FiEye}>
                      View
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

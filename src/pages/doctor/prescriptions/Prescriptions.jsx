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
import Avatar from "../../../components/ui/Avatar";
import { formatDate } from "../../../utils/formatDate";
import { friendlyError } from "../../../utils/errorMessage";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-[#14142B]">Prescriptions</h1>
        <p className="mt-1 text-sm text-[#64748B]">All prescriptions you've generated.</p>
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
        ) : list.length === 0 ? (
          <EmptyState icon={FiClipboard} title="No prescriptions yet" />
        ) : (
          <Table columns={["Patient", "Date", "Medicines", "Follow-up", "Action"]}>
            {list.map((rx) => (
              <tr key={rx.id} className="transition-colors hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={rx.patient?.name} id={rx.patient?.id} size="sm" />
                    <span className="font-bold text-[#14142B]">{rx.patient?.name || "—"}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#64748B]">
                  {formatDate(rx.date)}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <Badge color="primary">
                    {rx.medicines?.length || 0} medicine(s)
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#64748B]">
                  {rx.followUpDate ? formatDate(rx.followUpDate) : "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <Link to={`/doctor/prescriptions/${rx.id}`}>
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClipboard } from "react-icons/fi";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import Spinner from "../../../components/ui/Spinner";
import { formatDate } from "../../../utils/formatDate";

export default function Prescriptions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setList(await prescriptionService.getPrescriptions());
      setLoading(false);
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
        ) : list.length === 0 ? (
          <EmptyState icon={FiClipboard} title="No prescriptions yet" />
        ) : (
          <Table columns={["Prescription ID", "Patient", "Date", "Diagnosis", "Status", "Action"]}>
            {list.map((rx) => (
              <tr key={rx.id}>
                <td className="py-3 pr-4 font-medium text-navy whitespace-nowrap">{rx.id}</td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{rx.patient?.name}</td>
                <td className="py-3 pr-4 text-muted whitespace-nowrap">{formatDate(rx.date)}</td>
                <td className="py-3 pr-4 text-muted">{rx.diagnosis}</td>
                <td className="py-3 pr-4"><Badge color="success">{rx.status}</Badge></td>
                <td className="py-3 pr-4">
                  <Link to={`/doctor/prescriptions/${rx.id}`}>
                    <Button size="sm" variant="outline">View</Button>
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

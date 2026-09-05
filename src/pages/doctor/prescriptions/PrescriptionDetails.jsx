import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiDownload, FiPrinter } from "react-icons/fi";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import PrescriptionPreview from "../../../components/prescriptions/PrescriptionPreview";

export default function PrescriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rx, setRx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setRx(await prescriptionService.getPrescriptionById(id));
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} /></div>;
  if (!rx) return <p className="text-muted">Prescription not found.</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-navy">
          <FiArrowLeft size={16} /> Back
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={FiPrinter} onClick={() => window.print()}>
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={FiDownload}
            onClick={() => toast("PDF download will be wired up once the backend is connected.")}
          >
            Download PDF
          </Button>
        </div>
      </div>

      <PrescriptionPreview prescription={rx} patient={rx.patient} doctor={rx.doctor} />
    </motion.div>
  );
}

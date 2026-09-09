import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiDownload, FiPrinter, FiAlertTriangle } from "react-icons/fi";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import { patientService } from "../../../services/patients/patientService";
import { consultationService } from "../../../services/consultations/consultationService";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import PrescriptionPreview from "../../../components/prescriptions/PrescriptionPreview";
import { friendlyError } from "../../../utils/errorMessage";
import { downloadElementAsPdf } from "../../../utils/downloadPdf";

export default function PrescriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rx, setRx] = useState(null);
  const [patient, setPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await prescriptionService.getPrescriptionById(id);
        setRx(data);
        if (data?.patient) {
          setPatient(data.patient);
        } else if (data?.patientId) {
          patientService.getPatientByIdSafe(data.patientId).then(setPatient);
        }
        if (data?.consultationId) {
          consultationService
            .getConsultationById(data.consultationId)
            .then((c) => setDiagnosis(c?.diagnosis || ""))
            .catch(() => {});
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} /></div>;
  if (error) {
    return (
      <Card>
        <EmptyState icon={FiAlertTriangle} title="Failed to load prescription" subtitle={friendlyError(error)} />
      </Card>
    );
  }
  if (!rx) return <p className="text-muted">Prescription not found.</p>;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadElementAsPdf("prescription-preview", `prescription-${rx.id}.pdf`);
    } catch (err) {
      toast.error(err.message || "Could not download PDF");
    } finally {
      setDownloading(false);
    }
  };

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
          <Button size="sm" icon={FiDownload} loading={downloading} onClick={handleDownload}>
            Download PDF
          </Button>
        </div>
      </div>

      <PrescriptionPreview prescription={{ ...rx, diagnosis }} patient={patient} doctor={user} />
    </motion.div>
  );
}

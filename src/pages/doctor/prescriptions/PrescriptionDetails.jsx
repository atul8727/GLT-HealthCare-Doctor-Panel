import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiDownload, FiPrinter, FiAlertTriangle } from "react-icons/fi";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import { patientService } from "../../../services/patients/patientService";
import { consultationService } from "../../../services/consultations/consultationService";
import { vitalsService } from "../../../services/vitals/vitalsService";
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
  const { user } = useAuth();
  const [rx, setRx] = useState(null);
  const [patient, setPatient] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [vitals, setVitals] = useState(null);
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

        let p = data?.patient || null;
        if (!p && data?.patientId) {
          p = await patientService.getPatientByIdSafe(data.patientId);
        }
        setPatient(p);

        if (data?.consultationId) {
          try {
            const [c, v] = await Promise.all([
              consultationService.getConsultationById(data.consultationId),
              vitalsService.getConsultationVitals(data.consultationId).catch(() => []),
            ]);
            setConsultation(c);
            if (v?.length) {
              setVitals(v[0]);
            } else if (data.patientId) {
              const pv = await vitalsService.getPatientVitals(data.patientId).catch(() => []);
              setVitals(pv?.[0] || null);
            }
          } catch {
            // best-effort fallback
          }
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
  if (!rx) return <Card><EmptyState title="Prescription not found." /></Card>;

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14142B]">Prescription Details</h1>
          <p className="mt-1 text-sm text-[#64748B]">Preview, print, or download official prescription.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={FiPrinter} onClick={() => window.print()}>
            Print
          </Button>
          <Button size="sm" icon={FiDownload} loading={downloading} onClick={handleDownload}>
            Download PDF
          </Button>
        </div>
      </div>

      <PrescriptionPreview
        prescription={rx}
        patient={patient}
        doctor={user}
        consultation={consultation}
        vitals={vitals}
      />
    </motion.div>
  );
}

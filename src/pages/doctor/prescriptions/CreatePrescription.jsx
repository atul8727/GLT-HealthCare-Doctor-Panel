import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiFileText, FiAlertTriangle } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import { vitalsService } from "../../../services/vitals/vitalsService";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import MedicineForm from "../../../components/prescriptions/MedicineForm";
import PrescriptionPreview from "../../../components/prescriptions/PrescriptionPreview";
import { friendlyError } from "../../../utils/errorMessage";

export default function CreatePrescription() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const consultationId = params.get("consultationId");

  const [consultation, setConsultation] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [existingRx, setExistingRx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [medicines, setMedicines] = useState([
    { id: "MED-1", name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [testsRecommended, setTestsRecommended] = useState("");
  const [additionalAdvice, setAdditionalAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    if (!consultationId) {
      setLoading(false);
      setError({ message: "Consultation ID is missing." });
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [c, rx, v] = await Promise.all([
          consultationService.getConsultationById(consultationId),
          prescriptionService.getConsultationPrescription(consultationId),
          vitalsService.getConsultationVitals(consultationId).catch(() => []),
        ]);
        setConsultation(c);
        setExistingRx(rx);
        setVitals(v?.[0] || null);
        setAdditionalAdvice(c?.advice || "");
        setFollowUpDate(c?.followUp || "");
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [consultationId]);

  const previewData = {
    diagnosis: consultation?.diagnosis,
    medicines,
    testsRecommended,
    additionalAdvice,
    followUpDate,
    date: new Date().toISOString().slice(0, 10),
  };

  const handleGenerate = async () => {
    setSaving(true);
    try {
      const created = await prescriptionService.createPrescription(consultationId, {
        medicines,
        testsRecommended,
        additionalAdvice,
        followUpDate,
      });
      toast.success("Prescription generated");
      navigate(`/doctor/prescriptions/${created.id}`);
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} /></div>;

  if (error) {
    return (
      <Card>
        <EmptyState icon={FiAlertTriangle} title="Failed to load" subtitle={friendlyError(error)} />
      </Card>
    );
  }

  if (consultation && consultation.status !== "Completed") {
    return (
      <Card>
        <EmptyState
          icon={FiAlertTriangle}
          title="Consultation is not Completed yet"
          subtitle={`A prescription can only be created for a "Completed" consultation. Its status is currently "${consultation.status}" — please submit clinical details to complete the consultation first.`}
        />
        <div className="mt-4 flex justify-center">
          <Link to={`/doctor/consultations/${consultationId}`}>
            <Button variant="outline" size="sm">Go to Consultation</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (existingRx) {
    return (
      <Card>
        <EmptyState
          icon={FiFileText}
          title="A prescription already exists for this consultation"
          subtitle="Only one prescription can be created per consultation."
        />
        <div className="mt-4 flex justify-center">
          <Link to={`/doctor/prescriptions/${existingRx.id}`}>
            <Button size="sm">View Prescription</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const patient = consultation?.patient;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-[#14142B]">Create Prescription</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Patient: <span className="font-bold text-[#14142B]">{patient?.name || "—"}</span> • Doctor:{" "}
          <span className="font-bold text-[#14142B]">{user?.name}</span>
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Diagnosis">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Recorded during consultation</p>
            <p className="mt-1 text-base font-bold text-[#14142B]">{consultation?.diagnosis || "—"}</p>
          </Card>

          <Card title="Medicines">
            <MedicineForm medicines={medicines} onChange={setMedicines} />
          </Card>

          <Card title="Additional Details" className="space-y-4">
            <Input
              label="Tests Recommended"
              value={testsRecommended}
              onChange={(e) => setTestsRecommended(e.target.value)}
              placeholder="e.g. CBC, LFT, Lipid Profile"
            />
            <Textarea
              label="Additional Advice"
              value={additionalAdvice}
              onChange={(e) => setAdditionalAdvice(e.target.value)}
              placeholder="Lifestyle advice, dietary instructions, etc."
            />
            <Input
              type="date"
              label="Follow-up Date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </Card>

          <div className="flex justify-end">
            <Button icon={FiFileText} loading={saving} onClick={handleGenerate}>
              Generate Prescription
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-20">
          <PrescriptionPreview
            prescription={previewData}
            patient={patient}
            doctor={user}
            consultation={consultation}
            vitals={vitals}
          />
        </div>
      </div>
    </motion.div>
  );
}

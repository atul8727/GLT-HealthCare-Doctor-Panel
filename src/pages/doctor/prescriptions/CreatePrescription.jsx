import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiSave, FiFileText } from "react-icons/fi";
import { patientService } from "../../../services/patients/patientService";
import { consultationService } from "../../../services/consultations/consultationService";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import MedicineForm from "../../../components/prescriptions/MedicineForm";
import PrescriptionPreview from "../../../components/prescriptions/PrescriptionPreview";

export default function CreatePrescription() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientId = params.get("patientId");
  const consultationId = params.get("consultationId");

  const [patient, setPatient] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { id: "MED-1", name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [testsRecommended, setTestsRecommended] = useState("");
  const [additionalAdvice, setAdditionalAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const p = await patientService.getPatientById(patientId);
      setPatient(p);
      if (consultationId) {
        const c = await consultationService.getConsultationById(consultationId);
        setConsultation(c);
        setDiagnosis(c?.diagnosis || "");
        setAdditionalAdvice(c?.advice || "");
        setFollowUpDate(c?.followUp || "");
      }
      setLoading(false);
    })();
  }, [patientId, consultationId]);

  const previewData = { diagnosis, medicines, testsRecommended, additionalAdvice, followUpDate, date: "2026-09-03" };

  const handleGenerate = async ({ asDraft = false } = {}) => {
    setSaving(true);
    const created = await prescriptionService.createPrescription({
      patientId,
      consultationId,
      diagnosis,
      medicines: medicines.filter((m) => m.name.trim()),
      testsRecommended,
      additionalAdvice,
      followUpDate,
      status: asDraft ? "Draft" : "Generated",
    });
    setSaving(false);
    toast.success(asDraft ? "Prescription saved as draft" : `Prescription ${created.id} generated`);
    if (!asDraft) navigate(`/doctor/prescriptions/${created.id}`);
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">Create Prescription</h1>
        <p className="text-sm text-muted mt-1">
          Patient: <span className="font-medium text-navy">{patient?.name}</span> • Doctor:{" "}
          <span className="font-medium text-navy">{user?.name}</span>
          {consultation && <> • Consultation: <span className="font-medium text-navy">{consultation.id}</span></>}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Input label="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Viral Fever" />
          </Card>

          <Card>
            <p className="font-semibold text-navy mb-3">Medicines</p>
            <MedicineForm medicines={medicines} onChange={setMedicines} />
          </Card>

          <Card className="space-y-4">
            <Input label="Tests Recommended" value={testsRecommended} onChange={(e) => setTestsRecommended(e.target.value)} placeholder="e.g. CBC, LFT" />
            <Textarea label="Additional Advice" value={additionalAdvice} onChange={(e) => setAdditionalAdvice(e.target.value)} placeholder="Advice for the patient" />
            <Input type="date" label="Follow-up Date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
          </Card>

          <div className="flex flex-wrap gap-3 justify-end">
            <Button variant="outline" icon={FiSave} loading={saving} onClick={() => handleGenerate({ asDraft: true })}>
              Save Draft
            </Button>
            <Button icon={FiFileText} loading={saving} onClick={() => handleGenerate()}>
              Generate Prescription
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-20">
          <PrescriptionPreview prescription={previewData} patient={patient} doctor={user} />
        </div>
      </div>
    </motion.div>
  );
}

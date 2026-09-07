import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiVideo, FiCheckCircle, FiFileText, FiAlertTriangle } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import { vitalsService } from "../../../services/vitals/vitalsService";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import Spinner from "../../../components/ui/Spinner";
import StatusBadge from "../../../components/common/StatusBadge";
import VitalsCard from "../../../components/common/VitalsCard";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDate } from "../../../utils/formatDate";
import { friendlyError } from "../../../utils/errorMessage";

const FIELDS = [
  { key: "chiefComplaint", label: "Chief Complaint", placeholder: "Patient ki main complaint / symptoms" },
  { key: "medicalHistory", label: "Medical History", placeholder: "Relevant previous medical history" },
  { key: "examination", label: "Examination / Observations", placeholder: "Doctor ke examination observations" },
  { key: "diagnosis", label: "Diagnosis *", placeholder: "Diagnosis (required)" },
  { key: "notes", label: "Consultation Notes", placeholder: "Detailed consultation notes" },
  { key: "advice", label: "Advice", placeholder: "Patient ko di gayi advice" },
];

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [form, setForm] = useState({});
  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationService.getConsultationById(id);
      setConsultation(data);
      if (data) {
        setForm({
          chiefComplaint: data.chiefComplaint || "",
          medicalHistory: data.medicalHistory || "",
          examination: data.examination || "",
          diagnosis: data.diagnosis || "",
          notes: data.notes || "",
          advice: data.advice || "",
          followUp: data.followUp || "",
        });

        // Consultation ke time par record ki gayi vitals; agar na milein
        // to patient ki latest vitals dikha do.
        try {
          const cVitals = await vitalsService.getConsultationVitals(id);
          if (cVitals?.length) {
            setVitals(cVitals[0]);
          } else if (data.patientId) {
            const pVitals = await vitalsService.getPatientVitals(data.patientId);
            setVitals(pVitals[0] || null);
          }
        } catch {
          setVitals(null);
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleJoinMeet = () => {
    window.open(consultation.meetLink, "_blank");
  };

  // Backend rule: submitClinicalDetails call hone ke saath hi consultation
  // "Completed" ho jaati hai — isme koi "draft" concept nahi hai, isliye
  // submit se pehle clearly confirm kar lete hain.
  const handleSubmit = async () => {
    if (!form.diagnosis || !form.diagnosis.trim()) {
      toast.error("Diagnosis likhna zaroori hai.");
      return;
    }
    if (
      !window.confirm(
        "Submit karte hi yeh consultation 'Completed' ho jayegi aur dobara edit nahi ho payegi. Continue karein?"
      )
    ) {
      return;
    }
    setSubmitting(true);
    try {
      await consultationService.submitClinicalDetails(id, form);
      toast.success("Consultation completed");
      await load();
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} /></div>;
  if (error) {
    return (
      <Card>
        <EmptyState
          icon={error.status === 403 ? undefined : FiAlertTriangle}
          title={error.status === 403 ? "Permission denied" : "Consultation load nahi hui"}
          subtitle={friendlyError(error)}
        />
      </Card>
    );
  }
  if (!consultation) return <p className="text-muted">Consultation not found.</p>;

  const p = consultation.patient;
  // Backend sirf "Scheduled" status wali consultation par hi clinical
  // details submit karne deta hai.
  const canSubmit = consultation.status === "Scheduled";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <FiArrowLeft size={16} /> Back
      </button>

      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <p className="font-bold text-navy">{p?.name}</p>
            <StatusBadge status={consultation.status} />
          </div>
          <p className="text-sm text-muted mt-1">
            {formatDate(consultation.date)} • {consultation.time} • {consultation.type}
          </p>
        </div>
        {canSubmit && consultation.meetLink && (
          <Button icon={FiVideo} onClick={handleJoinMeet}>
            Join Google Meet
          </Button>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-5 items-start">
        <div className="space-y-5">
          <Card>
            <p className="font-semibold text-navy mb-3">Patient Information</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Age</span><span className="font-medium">{p?.age}</span></div>
              <div className="flex justify-between"><span className="text-muted">Gender</span><span className="font-medium">{p?.gender}</span></div>
              <div className="flex justify-between"><span className="text-muted">Mobile</span><span className="font-medium">{p?.mobile}</span></div>
            </div>
            {p?.id ? (
              <Link to={`/doctor/patients/${p.id}`} className="text-sm text-primary font-medium hover:underline block mt-3 pt-3 border-t border-slate-100">
                View Full Patient Profile →
              </Link>
            ) : (
              <p className="text-xs text-muted block mt-3 pt-3 border-t border-slate-100">
                Patient profile abhi load nahi ho payi.
              </p>
            )}
          </Card>

          {vitals && (
            <VitalsCard
              vitals={{
                bp: vitals.bp,
                pulse: vitals.pulse,
                temperature: vitals.temperature,
                spo2: vitals.spo2,
                weight: vitals.weight,
                height: vitals.height,
                bmi: vitals.bmi,
                recordedOn: vitals.date,
              }}
            />
          )}
        </div>

        <div className="lg:col-span-2 space-y-5">
          <Card className="space-y-4">
            <p className="font-semibold text-navy">Consultation</p>
            {!canSubmit && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Yeh consultation "{consultation.status}" status mein hai, isliye clinical details ab
                edit/submit nahi ki ja sakti (sirf "Scheduled" consultations editable hoti hain).
              </p>
            )}
            {FIELDS.map((f) => (
              <Textarea
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                disabled={!canSubmit}
                rows={f.key === "chiefComplaint" || f.key === "diagnosis" ? 2 : 3}
              />
            ))}
            <Textarea
              label="Follow-up"
              placeholder="Follow-up recommendation"
              rows={2}
              value={form.followUp}
              onChange={(e) => handleChange("followUp", e.target.value)}
              disabled={!canSubmit}
            />
          </Card>

          {canSubmit && (
            <div className="flex flex-wrap gap-3 justify-end">
              <Button icon={FiCheckCircle} loading={submitting} onClick={handleSubmit}>
                Submit &amp; Complete Consultation
              </Button>
            </div>
          )}

          {consultation.status === "Completed" && (
            <div className="flex flex-wrap gap-3 justify-end">
              <Button
                icon={FiFileText}
                disabled={!p?.id}
                title={!p?.id ? "Patient info load hone ka wait karein" : undefined}
                onClick={() => navigate(`/doctor/prescriptions/create?consultationId=${id}&patientId=${p?.id || ""}`)}
              >
                Create Prescription
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
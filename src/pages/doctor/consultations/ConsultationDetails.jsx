import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiVideo, FiCheckCircle, FiFileText, FiAlertTriangle } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import { vitalsService } from "../../../services/vitals/vitalsService";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
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
  { key: "chiefComplaint", label: "Chief Complaint", placeholder: "Patient's main complaint / symptoms" },
  { key: "medicalHistory", label: "Medical History", placeholder: "Relevant previous medical history" },
  { key: "examination", label: "Examination / Observations", placeholder: "Doctor's examination observations" },
  { key: "diagnosis", label: "Diagnosis *", placeholder: "Diagnosis (required)" },
  { key: "notes", label: "Consultation Notes", placeholder: "Detailed consultation notes" },
  { key: "advice", label: "Advice", placeholder: "Advice given to the patient" },
];

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [form, setForm] = useState({});
  const [vitals, setVitals] = useState(null);
  const [existingRx, setExistingRx] = useState(null);
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

        // Vitals recorded at the time of this consultation; if none exist,
        // fall back to the patient's latest recorded vitals.
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

        // If the consultation is Completed, check whether a prescription
        // has already been created for it.
        if (data.status === "Completed") {
          try {
            const rx = await prescriptionService.getConsultationPrescription(id);
            setExistingRx(rx);
          } catch {
            setExistingRx(null);
          }
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

  // Backend rule: as soon as submitClinicalDetails succeeds, the consultation
  // becomes "Completed" — there is no "draft" concept. The permanence of this
  // action is explained to the doctor inline (see the notice above the
  // submit button), so no blocking browser dialog is used here.
  const handleSubmit = async () => {
    if (!form.diagnosis || !form.diagnosis.trim()) {
      toast.error("Diagnosis is required.");
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
          title={error.status === 403 ? "Permission denied" : "Failed to load consultation"}
          subtitle={friendlyError(error)}
        />
      </Card>
    );
  }
  if (!consultation) return <p className="text-muted">Consultation not found.</p>;

  const p = consultation.patient;
  // The backend only allows clinical details to be submitted while a
  // consultation is in "Scheduled" status.
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
                Patient profile could not be loaded.
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
                This consultation is in "{consultation.status}" status, so clinical details can no
                longer be edited or submitted (only "Scheduled" consultations are editable).
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
            <div className="space-y-2">
              <p className="text-xs text-muted bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                Submitting will mark this consultation as "Completed" and it cannot be edited again
                afterwards.
              </p>
              <div className="flex flex-wrap gap-3 justify-end">
                <Button icon={FiCheckCircle} loading={submitting} onClick={handleSubmit}>
                  Submit &amp; Complete Consultation
                </Button>
              </div>
            </div>
          )}

          {consultation.status === "Completed" && (
            <div className="flex flex-wrap gap-3 justify-end">
              {existingRx ? (
                <Button icon={FiFileText} onClick={() => navigate(`/doctor/prescriptions/${existingRx.id}`)}>
                  View Prescription
                </Button>
              ) : (
                <Button
                  icon={FiFileText}
                  onClick={() => navigate(`/doctor/prescriptions/create?consultationId=${id}`)}
                >
                  Create Prescription
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
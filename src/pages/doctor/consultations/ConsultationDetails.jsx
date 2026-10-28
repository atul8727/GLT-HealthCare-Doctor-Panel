import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiVideo, FiCheckCircle, FiFileText, FiAlertTriangle, FiUser, FiInfo } from "react-icons/fi";
import { consultationService } from "../../../services/consultations/consultationService";
import { vitalsService } from "../../../services/vitals/vitalsService";
import { prescriptionService } from "../../../services/prescriptions/prescriptionService";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import Spinner from "../../../components/ui/Spinner";
import Avatar from "../../../components/ui/Avatar";
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
  if (!consultation) return <Card><EmptyState title="Consultation not found." /></Card>;

  const p = consultation.patient;
  const canSubmit = consultation.status === "Scheduled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Header Card */}
      <Card className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar name={p?.name} id={p?.id || consultation.patientId} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="text-xl font-extrabold text-[#14142B]">{p?.name || "Patient"}</p>
              <StatusBadge status={consultation.status} />
            </div>
            <p className="mt-1 text-sm text-[#64748B]">
              {formatDate(consultation.date)} • {consultation.time} • {consultation.type} Consultation
            </p>
          </div>
        </div>
        {canSubmit && consultation.meetLink && (
          <Button icon={FiVideo} onClick={handleJoinMeet}>
            Join Google Meet
          </Button>
        )}
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        {/* Left Column: Patient info & Vitals */}
        <div className="space-y-5">
          <Card title="Patient Information" icon={FiUser}>
            <dl className="space-y-3">
              {[
                ["Age", p?.age ? `${p.age} Years` : "—"],
                ["Gender", p?.gender || "—"],
                ["Mobile", p?.mobile || "—"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-sm"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{label}</dt>
                  <dd className="font-semibold text-[#14142B]">{val}</dd>
                </div>
              ))}
            </dl>

            {p?.id ? (
              <Link
                to={`/doctor/patients/${p.id}`}
                className="mt-4 block border-t border-[#E2E8F0] pt-3 text-center text-sm font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA] hover:underline"
              >
                View Full Patient Profile →
              </Link>
            ) : (
              <p className="mt-4 border-t border-[#E2E8F0] pt-3 text-center text-xs text-[#64748B]">
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

        {/* Right Column: Consultation Clinical Form */}
        <div className="space-y-5 lg:col-span-2">
          <Card title="Clinical Details" className="space-y-4">
            {!canSubmit && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800">
                <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p>
                  This consultation is in <strong>"{consultation.status}"</strong> status. Clinical details can only be edited or submitted while in "Scheduled" status.
                </p>
              </div>
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
              label="Follow-up Recommendation"
              placeholder="Follow-up recommendation or instructions"
              rows={2}
              value={form.followUp}
              onChange={(e) => handleChange("followUp", e.target.value)}
              disabled={!canSubmit}
            />
          </Card>

          {canSubmit && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs text-[#64748B]">
                <FiInfo className="h-4 w-4 shrink-0 text-[#4F46E5]" />
                <span>
                  Submitting will mark this consultation as <strong>"Completed"</strong> and it cannot be edited again afterwards.
                </span>
              </div>
              <div className="flex justify-end">
                <Button icon={FiCheckCircle} loading={submitting} onClick={handleSubmit}>
                  Submit &amp; Complete Consultation
                </Button>
              </div>
            </div>
          )}

          {consultation.status === "Completed" && (
            <div className="flex justify-end">
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

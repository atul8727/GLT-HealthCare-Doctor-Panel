import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPlayCircle, FiPlus, FiFileText, FiAlertTriangle } from "react-icons/fi";
import { patientService } from "../../../services/patients/patientService";
import { vitalsService } from "../../../services/vitals/vitalsService";
import { friendlyError } from "../../../utils/errorMessage";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Tabs from "../../../components/ui/Tabs";
import Spinner from "../../../components/ui/Spinner";
import StatusBadge from "../../../components/common/StatusBadge";
import VitalsCard from "../../../components/common/VitalsCard";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDate } from "../../../utils/formatDate";

const TABS = ["Overview", "Vitals", "Consultations", "Prescriptions"];

const EMPTY_VITALS_FORM = { bp: "", pulse: "", temperature: "", spo2: "", weight: "", height: "" };

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vitalsForm, setVitalsForm] = useState(EMPTY_VITALS_FORM);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [savingVitals, setSavingVitals] = useState(false);

  const loadVitals = async () => {
    try {
      const v = await vitalsService.getPatientVitals(id);
      setVitalsHistory(v);
    } catch {
      setVitalsHistory([]);
    }
  };

  useEffect(() => {
    if (!id || id === "undefined") {
      setLoading(false);
      setError({ message: "Patient ID missing hai." });
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [p, c, rx] = await Promise.all([
          patientService.getPatientById(id),
          patientService.getPatientConsultations(id).catch(() => []),
          patientService.getPatientPrescriptions(id).catch(() => []),
        ]);
        setPatient(p);
        setConsultations(c);
        setPrescriptions(rx);
        await loadVitals();
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRecordVitals = async () => {
    setSavingVitals(true);
    try {
      await vitalsService.recordVitals(id, vitalsForm);
      toast.success("Vitals recorded");
      setVitalsForm(EMPTY_VITALS_FORM);
      setShowVitalsForm(false);
      await loadVitals();
    } catch (err) {
      toast.error(err.message || "Vitals record nahi ho paaye");
    } finally {
      setSavingVitals(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} /></div>;
  if (error) {
    return (
      <Card>
        <EmptyState
          icon={error.status === 403 ? undefined : FiAlertTriangle}
          title={error.status === 403 ? "Permission denied" : "Patient load nahi ho paya"}
          subtitle={friendlyError(error)}
        />
      </Card>
    );
  }
  if (!patient) return <EmptyState title="Patient not found" />;

  const initials = patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const nextConsultation = consultations.find((c) => c.status === "Scheduled");
  const latestVitals = vitalsHistory[0] || null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <FiArrowLeft size={16} /> Back
      </button>

      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-navy">{patient.name}</p>
            <p className="text-sm text-muted">Patient ID: {patient.id}</p>
            <p className="text-sm text-muted mt-0.5">
              {patient.age} yrs • {patient.gender} • {patient.mobile}
            </p>
          </div>
        </div>
        {nextConsultation && (
          <Link to={`/doctor/consultations/${nextConsultation.id}`}>
            <Button icon={FiPlayCircle}>Start Consultation</Button>
          </Link>
        )}
      </Card>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Overview" && (
        <Card>
          <p className="font-semibold text-navy mb-4">Patient Information</p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              ["Name", patient.name],
              ["Patient ID", patient.id],
              ["Age", patient.age],
              ["Gender", patient.gender],
              ["Mobile", patient.mobile],
              ["Email", patient.email],
              ["Address", patient.address],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-muted">{label}</span>
                <span className="font-medium text-navy text-right">{val || "—"}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Vitals" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="space-y-5">
            {latestVitals ? (
              <VitalsCard
                vitals={{
                  bp: latestVitals.bp,
                  pulse: latestVitals.pulse,
                  temperature: latestVitals.temperature,
                  spo2: latestVitals.spo2,
                  weight: latestVitals.weight,
                  height: latestVitals.height,
                  bmi: latestVitals.bmi,
                  recordedOn: latestVitals.date,
                }}
              />
            ) : (
              <Card><EmptyState title="No vitals recorded yet" /></Card>
            )}

            {!showVitalsForm ? (
              <Button variant="outline" icon={FiPlus} onClick={() => setShowVitalsForm(true)}>
                Record New Vitals
              </Button>
            ) : (
              <Card className="space-y-4">
                <p className="font-semibold text-navy">Record Vitals</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Blood Pressure" placeholder="120/80" value={vitalsForm.bp} onChange={(e) => setVitalsForm((f) => ({ ...f, bp: e.target.value }))} />
                  <Input label="Pulse Rate" placeholder="72" value={vitalsForm.pulse} onChange={(e) => setVitalsForm((f) => ({ ...f, pulse: e.target.value }))} />
                  <Input label="Temperature (°F)" placeholder="98.6" value={vitalsForm.temperature} onChange={(e) => setVitalsForm((f) => ({ ...f, temperature: e.target.value }))} />
                  <Input label="SpO₂ (%)" placeholder="98" value={vitalsForm.spo2} onChange={(e) => setVitalsForm((f) => ({ ...f, spo2: e.target.value }))} />
                  <Input label="Weight (kg)" placeholder="70" value={vitalsForm.weight} onChange={(e) => setVitalsForm((f) => ({ ...f, weight: e.target.value }))} />
                  <Input label="Height (cm)" placeholder="175" value={vitalsForm.height} onChange={(e) => setVitalsForm((f) => ({ ...f, height: e.target.value }))} />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={() => setShowVitalsForm(false)}>Cancel</Button>
                  <Button loading={savingVitals} onClick={handleRecordVitals}>Save Vitals</Button>
                </div>
              </Card>
            )}
          </div>

          <Card>
            <p className="font-semibold text-navy mb-3">Vitals History</p>
            {vitalsHistory.length === 0 ? (
              <EmptyState title="No vitals history" />
            ) : (
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-muted text-left">
                      <th className="py-2 pr-3">Date</th>
                      <th className="py-2 pr-3">BP</th>
                      <th className="py-2 pr-3">Pulse</th>
                      <th className="py-2 pr-3">Temp</th>
                      <th className="py-2 pr-3">SpO₂</th>
                      <th className="py-2 pr-3">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vitalsHistory.map((v) => (
                      <tr key={v.id || v.date}>
                        <td className="py-2 pr-3 whitespace-nowrap">{formatDate(v.date)}</td>
                        <td className="py-2 pr-3">{v.bp}</td>
                        <td className="py-2 pr-3">{v.pulse}</td>
                        <td className="py-2 pr-3">{v.temperature}</td>
                        <td className="py-2 pr-3">{v.spo2}</td>
                        <td className="py-2 pr-3">{v.weight} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === "Consultations" && (
        <Card>
          {consultations.length === 0 ? (
            <EmptyState title="No consultations yet" />
          ) : (
            <div className="divide-y divide-slate-100">
              {consultations.map((c) => (
                <Link
                  key={c.id}
                  to={`/doctor/consultations/${c.id}`}
                  className="flex items-center justify-between py-3.5 hover:bg-slate-50 -mx-5 px-5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">
                      {formatDate(c.date)} • {c.time}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{c.diagnosis || "Diagnosis pending"}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "Prescriptions" && (
        <Card>
          {prescriptions.length === 0 ? (
            <EmptyState icon={FiFileText} title="No prescriptions yet" />
          ) : (
            <div className="divide-y divide-slate-100">
              {prescriptions.map((rx) => (
                <Link
                  key={rx.id}
                  to={`/doctor/prescriptions/${rx.id}`}
                  className="flex items-center justify-between py-3.5 hover:bg-slate-50 -mx-5 px-5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">{rx.id}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {rx.diagnosis} • {formatDate(rx.date)}
                    </p>
                  </div>
                  <span className="text-sm text-primary font-medium">View →</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
    </motion.div>
  );
}

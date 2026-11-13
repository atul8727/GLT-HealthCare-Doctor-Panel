import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlayCircle, FiPlus, FiFileText, FiAlertTriangle } from "react-icons/fi";
import { patientService } from "../../../services/patients/patientService";
import { vitalsService } from "../../../services/vitals/vitalsService";
import { friendlyError } from "../../../utils/errorMessage";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Tabs from "../../../components/ui/Tabs";
import Avatar from "../../../components/ui/Avatar";
import Table from "../../../components/ui/Table";
import Spinner from "../../../components/ui/Spinner";
import StatusBadge from "../../../components/common/StatusBadge";
import VitalsCard from "../../../components/common/VitalsCard";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDate } from "../../../utils/formatDate";

const TABS = ["Overview", "Vitals", "Consultations", "Prescriptions"];

const EMPTY_VITALS_FORM = { bp: "", pulse: "", temperature: "", spo2: "", weight: "", height: "" };

const TILE = "rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4";
const TILE_LABEL = "text-xs font-semibold uppercase tracking-wider text-[#64748B]";
const ROW_LINK =
  "flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-colors hover:bg-indigo-50/60";

export default function PatientDetails() {
  const { id } = useParams();
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
      setError({ message: "Patient ID is missing." });
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
      toast.error(err.message || "Could not record vitals");
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
          title={error.status === 403 ? "Permission denied" : "Failed to load patient"}
          subtitle={friendlyError(error)}
        />
      </Card>
    );
  }
  if (!patient) {
    return (
      <Card>
        <EmptyState title="Patient not found" />
      </Card>
    );
  }

  const nextConsultation = consultations.find((c) => c.status === "Scheduled");
  const latestVitals = vitalsHistory[0] || null;
  const lastCompletedConsultation = consultations.find((c) => c.status === "Completed");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <Card className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar name={patient.name} id={patient.id} size="lg" />
          <div className="min-w-0">
            <p className="text-xl font-extrabold text-[#14142B]">{patient.name}</p>
            <p className="mt-0.5 text-sm text-[#64748B]">
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
        <div className="space-y-5">
          <Card title="Medical Summary">
            <p className="mb-4 text-sm text-[#64748B]">
              A full picture of the patient before you start the consultation, so you can consult
              effectively.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={TILE}>
                <p className={`${TILE_LABEL} mb-2`}>Last Diagnosis / Complaint</p>
                {lastCompletedConsultation ? (
                  <>
                    <p className="font-bold text-[#14142B]">{lastCompletedConsultation.diagnosis || "—"}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{lastCompletedConsultation.chiefComplaint || "—"}</p>
                    <p className="mt-2 text-xs text-[#64748B]">{formatDate(lastCompletedConsultation.date)}</p>
                  </>
                ) : (
                  <p className="text-sm text-[#64748B]">No past consultation found.</p>
                )}
              </div>
              <div className={TILE}>
                <p className={`${TILE_LABEL} mb-2`}>Latest Vitals</p>
                {latestVitals ? (
                  <>
                    <p className="text-sm font-semibold text-[#14142B]">
                      BP {latestVitals.bp || "—"} • Pulse {latestVitals.pulse || "—"} • Temp {latestVitals.temperature || "—"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#14142B]">
                      SpO₂ {latestVitals.spo2 || "—"} • Weight {latestVitals.weight || "—"} kg
                    </p>
                    <p className="mt-2 text-xs text-[#64748B]">{formatDate(latestVitals.date)}</p>
                  </>
                ) : (
                  <p className="text-sm text-[#64748B]">No vitals recorded.</p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Patient Information">
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Name", patient.name],
                ["Age", patient.age],
                ["Gender", patient.gender],
                ["Mobile", patient.mobile],
                ["Email", patient.email],
                ["Address", patient.address],
              ].map(([label, val]) => (
                <div key={label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <dt className={TILE_LABEL}>{label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-[#14142B]">{val || "—"}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}

      {tab === "Vitals" && (
        <div className="grid gap-5 lg:grid-cols-2">
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
              <Button icon={FiPlus} onClick={() => setShowVitalsForm(true)}>
                Record New Vitals
              </Button>
            ) : (
              <Card title="Record Vitals" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Blood Pressure" placeholder="120/80" value={vitalsForm.bp} onChange={(e) => setVitalsForm((f) => ({ ...f, bp: e.target.value }))} />
                  <Input label="Pulse Rate" placeholder="72" value={vitalsForm.pulse} onChange={(e) => setVitalsForm((f) => ({ ...f, pulse: e.target.value }))} />
                  <Input label="Temperature (°F)" placeholder="98.6" value={vitalsForm.temperature} onChange={(e) => setVitalsForm((f) => ({ ...f, temperature: e.target.value }))} />
                  <Input label="SpO₂ (%)" placeholder="98" value={vitalsForm.spo2} onChange={(e) => setVitalsForm((f) => ({ ...f, spo2: e.target.value }))} />
                  <Input label="Weight (kg)" placeholder="70" value={vitalsForm.weight} onChange={(e) => setVitalsForm((f) => ({ ...f, weight: e.target.value }))} />
                  <Input label="Height (cm)" placeholder="175" value={vitalsForm.height} onChange={(e) => setVitalsForm((f) => ({ ...f, height: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
                  <Button variant="outline" onClick={() => setShowVitalsForm(false)}>Cancel</Button>
                  <Button loading={savingVitals} onClick={handleRecordVitals}>Save Vitals</Button>
                </div>
              </Card>
            )}
          </div>

          <Card title="Vitals History">
            {vitalsHistory.length === 0 ? (
              <EmptyState title="No vitals history" />
            ) : (
              <Table columns={["Date", "BP", "Pulse", "Temp", "SpO₂", "Weight"]}>
                {vitalsHistory.map((v) => (
                  <tr key={v.id || v.date} className="transition-colors hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-4 py-3.5 text-[#64748B]">{formatDate(v.date)}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[#14142B]">{v.bp}</td>
                    <td className="px-4 py-3.5 text-[#14142B]">{v.pulse}</td>
                    <td className="px-4 py-3.5 text-[#14142B]">{v.temperature}</td>
                    <td className="px-4 py-3.5 text-[#14142B]">{v.spo2}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[#14142B]">{v.weight} kg</td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </div>
      )}

      {tab === "Consultations" && (
        <Card padding="p-2 sm:p-3">
          {consultations.length === 0 ? (
            <EmptyState title="No consultations yet" />
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {consultations.map((c) => (
                <Link key={c.id} to={`/doctor/consultations/${c.id}`} className={ROW_LINK}>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#14142B]">
                      {formatDate(c.date)} • {c.time}
                    </p>
                    <p className="mt-0.5 text-xs text-[#64748B]">{c.diagnosis || "Diagnosis pending"}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "Prescriptions" && (
        <Card padding="p-2 sm:p-3">
          {prescriptions.length === 0 ? (
            <EmptyState icon={FiFileText} title="No prescriptions yet" />
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {prescriptions.map((rx) => (
                <Link key={rx.id} to={`/doctor/prescriptions/${rx.id}`} className={ROW_LINK}>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#14142B]">Prescription</p>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      {rx.medicines?.length || 0} medicine(s) • {formatDate(rx.date)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#4F46E5]">View →</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
    </motion.div>
  );
}
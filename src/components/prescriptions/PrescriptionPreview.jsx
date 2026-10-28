import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiActivity,
  FiShield,
  FiEdit3,
  FiPackage,
  FiCheckSquare,
  FiHelpCircle,
} from "react-icons/fi";
import { formatDate } from "../../utils/formatDate";

export default function PrescriptionPreview({
  prescription,
  patient,
  doctor,
  consultation,
  vitals,
}) {
  const doctorName = doctor?.name || "Dr. Medical Practitioner";
  const doctorSpec = doctor?.specialization || "General Medicine";
  const doctorReg = doctor?.regNo || doctor?.id || "UP-123456";

  const patientName = patient?.name || "—";
  const patientAge = patient?.age ? `${patient.age} Years` : "—";
  const patientGender = patient?.gender || "—";
  const patientPhone = patient?.mobile || patient?.phone || "—";
  const patientAddress = patient?.address || "Noida, Uttar Pradesh";

  const rxDate = prescription?.date || consultation?.date || new Date();
  const rxTime = consultation?.time || "10:30 AM";
  const rxType = consultation?.type || "General Consultation";

  const diagnosis =
    prescription?.diagnosis || consultation?.diagnosis || "Diagnosis pending clinical review";

  const chiefComplaint =
    consultation?.chiefComplaint ||
    (consultation ? "General health consultation and check-up." : "");

  const medicalHistory = consultation?.medicalHistory || "";

  // Combine recorded vitals and consultation examination notes
  const vitalsArr = [];
  if (vitals?.temperature) vitalsArr.push(`Temperature: ${vitals.temperature}°F`);
  if (vitals?.pulse) vitalsArr.push(`Pulse: ${vitals.pulse}/min`);
  if (vitals?.bp) vitalsArr.push(`BP: ${vitals.bp} mmHg`);
  if (vitals?.spo2) vitalsArr.push(`SpO₂: ${vitals.spo2}%`);
  if (vitals?.weight) vitalsArr.push(`Weight: ${vitals.weight} kg`);
  const vitalsText = vitalsArr.join("  |  ");
  const examinationNotes = consultation?.examination || "";

  const consultationNotes = consultation?.notes || "";

  // Tests formatted as bullet points
  const testsRaw = prescription?.testsRecommended || "";
  const testsList = testsRaw
    ? testsRaw
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Advice formatted as bullet points
  const adviceRaw = prescription?.additionalAdvice || consultation?.advice || "";
  const adviceList = adviceRaw
    ? adviceRaw
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const followUp = prescription?.followUpDate
    ? `Follow up on ${formatDate(prescription.followUpDate)} or earlier if symptoms persist or worsen.`
    : consultation?.followUp
    ? consultation.followUp
    : "Follow up in 3 to 5 days or if symptoms worsen.";

  return (
    <div
      id="prescription-preview"
      className="mx-auto w-full max-w-[820px] rounded-2xl border border-slate-200 bg-white p-6 sm:p-9 text-[#14142B] shadow-card print:border-none print:p-0 print:shadow-none"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* ────────────────── TOP CLINIC & DOCTOR HEADER ────────────────── */}
      <div className="flex flex-col justify-between gap-6 pb-5 sm:flex-row sm:items-start border-b border-slate-200/80">
        {/* Left: Clinic Branding */}
        <div className="flex items-start gap-3.5">
          {/* Medical Cross Logo with Heartbeat */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white shadow-md">
            <svg
              className="h-9 w-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="3" />
              <path
                d="M4 12h3l2-4 3 8 2-4h6"
                stroke="#38BDF8"
                strokeWidth="1.8"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">GLT Healthcare</h1>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
              Better Health | Brighter Tomorrow
            </p>
            <div className="mt-2 space-y-0.5 text-xs text-[#64748B]">
              <p className="flex items-center gap-1.5">
                <FiMapPin className="h-3 w-3 text-[#0284C7] shrink-0" />
                <span>123 Health Street, Noida, Uttar Pradesh - 201301</span>
              </p>
              <p className="flex items-center gap-1.5">
                <FiPhone className="h-3 w-3 text-[#0284C7] shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-1.5">
                <FiMail className="h-3 w-3 text-[#0284C7] shrink-0" />
                <span>care@glthealthcare.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Doctor Profile */}
        <div className="flex items-start gap-3 sm:border-l sm:border-slate-200 sm:pl-6">
          <div className="text-left sm:text-right">
            <h2 className="text-xl font-black text-[#0F172A]">{doctorName}</h2>
            <p className="text-xs font-semibold text-[#475569]">
              MBBS, MD ({doctorSpec})
            </p>
            <p className="text-xs font-medium text-[#0284C7]">Consultant Physician</p>
            <p className="mt-1 text-xs font-bold text-[#64748B]">
              Reg. No. : <span className="text-[#0F172A]">{doctorReg}</span>
            </p>
          </div>
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0284C7] sm:flex">
            {/* Stethoscope Icon */}
            <svg
              className="h-6 w-6 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 3h3v5a3 3 0 0 1-6 0V3h3zm0 0v5" />
              <path d="M4.5 11a7.5 7.5 0 0 0 15 0V3h-3v8a4.5 4.5 0 0 1-9 0" />
              <circle cx="18" cy="18" r="3" />
              <path d="M19.5 11V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* ────────────────── PATIENT & CONSULTATION DETAILS BOX ────────────────── */}
      <div className="my-5 rounded-2xl border border-[#BFDBFE]/80 bg-[#F0F7FF] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Patient Details */}
          <div>
            <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-[#1D4ED8]">
              <FiUser className="h-4 w-4" />
              <span>Patient Details</span>
            </div>
            <dl className="grid grid-cols-[100px_1fr] gap-y-1 text-xs text-[#334155]">
              <dt className="text-[#64748B]">Name</dt>
              <dd className="font-bold text-[#0F172A]">: {patientName}</dd>

              <dt className="text-[#64748B]">Age / Gender</dt>
              <dd className="font-semibold">: {patientAge} / {patientGender}</dd>

              <dt className="text-[#64748B]">Phone</dt>
              <dd className="font-semibold">: {patientPhone}</dd>

              <dt className="text-[#64748B]">Address</dt>
              <dd className="font-semibold truncate">: {patientAddress}</dd>
            </dl>
          </div>

          {/* Consultation Details */}
          <div className="sm:border-l sm:border-blue-200/80 sm:pl-6">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-[#1D4ED8]">
              <FiCalendar className="h-4 w-4" />
              <span>Consultation Details</span>
            </div>
            <dl className="grid grid-cols-[120px_1fr] gap-y-1 text-xs text-[#334155]">
              <dt className="text-[#64748B]">Date</dt>
              <dd className="font-semibold text-[#0F172A]">: {formatDate(rxDate)}</dd>

              <dt className="text-[#64748B]">Time</dt>
              <dd className="font-semibold">: {rxTime}</dd>

              <dt className="text-[#64748B]">Consultation Type</dt>
              <dd className="font-semibold">: {rxType}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* ────────────────── CLINICAL DETAILS SECTIONS ────────────────── */}
      <div className="space-y-4">
        {/* Chief Complaint */}
        {chiefComplaint && (
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
                <FiFileText size={13} />
              </span>
              <span>Chief Complaint</span>
            </div>
            <p className="mt-1.5 pl-8 text-xs text-[#334155] leading-relaxed">
              {chiefComplaint}
            </p>
          </div>
        )}

        {/* Medical History */}
        {medicalHistory && (
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
                <FiUsers size={13} />
              </span>
              <span>Medical History</span>
            </div>
            <p className="mt-1.5 pl-8 text-xs text-[#334155] leading-relaxed">
              {medicalHistory}
            </p>
          </div>
        )}

        {/* Examination / Observations / Vitals */}
        {(vitalsText || examinationNotes) && (
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
                <FiActivity size={13} />
              </span>
              <span>Examination / Observations</span>
            </div>
            <div className="mt-1.5 pl-8 space-y-1 text-xs text-[#334155] leading-relaxed">
              {vitalsText && (
                <p className="font-semibold text-[#0F172A] bg-blue-50/50 inline-block px-2.5 py-1 rounded-md border border-blue-100">
                  {vitalsText}
                </p>
              )}
              {examinationNotes && <p>{examinationNotes}</p>}
            </div>
          </div>
        )}

        {/* Diagnosis */}
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
              <FiShield size={13} />
            </span>
            <span>Diagnosis</span>
          </div>
          <p className="mt-1.5 pl-8 text-xs font-bold text-[#0F172A] leading-relaxed">
            {diagnosis}
          </p>
        </div>

        {/* Consultation Notes */}
        {consultationNotes && (
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
                <FiEdit3 size={13} />
              </span>
              <span>Consultation Notes</span>
            </div>
            <p className="mt-1.5 pl-8 text-xs text-[#334155] leading-relaxed">
              {consultationNotes}
            </p>
          </div>
        )}
      </div>

      {/* ────────────────── MEDICINES TABLE ────────────────── */}
      <div className="mt-5 mb-5">
        <div className="mb-2.5 flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
            <FiPackage size={13} />
          </span>
          <span className="text-sm">Medicines</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#BFDBFE]">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-[#E8F3FF] text-[#1D4ED8]">
              <tr className="border-b border-[#BFDBFE]">
                <th className="w-10 border-r border-[#BFDBFE] px-2.5 py-2.5 text-center font-bold">#</th>
                <th className="border-r border-[#BFDBFE] px-3.5 py-2.5 font-bold">Medicine Name</th>
                <th className="border-r border-[#BFDBFE] px-3.5 py-2.5 font-bold">Dosage</th>
                <th className="border-r border-[#BFDBFE] px-3.5 py-2.5 font-bold">Frequency</th>
                <th className="border-r border-[#BFDBFE] px-3.5 py-2.5 font-bold">Duration</th>
                <th className="px-3.5 py-2.5 font-bold">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white text-[#334155]">
              {prescription?.medicines?.length ? (
                prescription.medicines.map((m, idx) => (
                  <tr key={m.id || idx} className="hover:bg-slate-50/60">
                    <td className="border-r border-slate-200/80 px-2.5 py-2.5 text-center font-bold text-[#64748B]">
                      {idx + 1}
                    </td>
                    <td className="border-r border-slate-200/80 px-3.5 py-2.5 font-bold text-[#0F172A]">
                      {m.name || "—"}
                    </td>
                    <td className="border-r border-slate-200/80 px-3.5 py-2.5 font-semibold text-[#334155]">
                      {m.dosage || "—"}
                    </td>
                    <td className="border-r border-slate-200/80 px-3.5 py-2.5 text-[#334155]">
                      {m.frequency || "—"}
                    </td>
                    <td className="border-r border-slate-200/80 px-3.5 py-2.5 text-[#334155]">
                      {m.duration || "—"}
                    </td>
                    <td className="px-3.5 py-2.5 text-[#475569]">
                      {m.instructions || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-xs text-[#64748B]">
                    No medicines added in this prescription.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────── TESTS, ADVICE & SIGNATURE / STAMP ────────────────── */}
      <div className="my-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Left: Tests Recommended & Follow-up */}
        <div className="space-y-4">
          {/* Tests Recommended */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
                <FiCheckSquare size={13} />
              </span>
              <span>Tests Recommended</span>
            </div>
            {testsList.length > 0 ? (
              <ul className="space-y-1 pl-8 text-xs text-[#334155]">
                {testsList.map((t, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#0284C7]">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pl-8 text-xs text-[#64748B]">None required at this time.</p>
            )}
          </div>

          {/* Follow-up Recommendation */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
                <FiCalendar size={13} />
              </span>
              <span>Follow-up Recommendation</span>
            </div>
            <p className="pl-8 text-xs text-[#334155] leading-relaxed">
              {followUp}
            </p>
          </div>
        </div>

        {/* Right: Additional Advice & Doctor Signature / Stamp */}
        <div className="space-y-4">
          {/* Additional Advice */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1D4ED8] text-white">
                <FiHelpCircle size={13} />
              </span>
              <span>Additional Advice</span>
            </div>
            {adviceList.length > 0 ? (
              <ul className="space-y-1 pl-8 text-xs text-[#334155]">
                {adviceList.map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#0284C7]">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pl-8 text-xs text-[#64748B]">Maintain adequate hydration and rest.</p>
            )}
          </div>

          {/* Signature & Clinic Official Stamp */}
          <div className="flex items-end justify-between pt-2">
            {/* Signature Block */}
            <div>
              {/* Doctor signature cursive SVG */}
              <div className="h-10 w-36">
                <svg
                  className="h-full w-full text-slate-800"
                  viewBox="0 0 160 45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 32 C 22 8, 30 40, 45 12 C 55 35, 68 8, 80 25 Q 92 35 105 20 T 135 24" />
                  <path d="M35 34 C 65 26, 105 28, 140 25" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#0F172A]">{doctorName}</p>
              <p className="text-[11px] text-[#64748B]">MBBS, MD ({doctorSpec})</p>
              <p className="text-[11px] font-semibold text-[#0284C7]">Reg. No. : {doctorReg}</p>
            </div>

            {/* Official Circular Clinic Stamp / Seal */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#1D4ED8] p-1 text-[#1D4ED8]">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-[#1D4ED8] p-1 text-center">
                <span className="text-[6px] font-black uppercase tracking-tight text-[#1D4ED8]">
                  GLT HEALTHCARE
                </span>
                <span className="my-0.5 text-xs font-serif leading-none">⚕</span>
                <span className="text-[6px] font-black uppercase tracking-widest text-[#1D4ED8]">
                  ★ NOIDA ★
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────── NOTICE BOX ────────────────── */}
      <div className="my-4 rounded-xl border border-[#BFDBFE]/80 bg-[#F0F7FF] px-4 py-2.5 text-center text-[11px] text-[#475569]">
        <strong>Note:</strong> This is a computer generated prescription for reference purposes only.
        Please follow the advice and medicines as per the doctor's guidance.
      </div>

      {/* ────────────────── FOOTER SLOGAN ────────────────── */}
      <div className="mt-4 flex items-center justify-center gap-3 text-xs font-bold text-[#0284C7]">
        <span className="h-px w-16 bg-[#BFDBFE]" />
        <span>Stay Healthy • Stay Positive</span>
        <span className="h-px w-16 bg-[#BFDBFE]" />
      </div>
    </div>
  );
}

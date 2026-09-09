import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizeConsultation, normalizePatient } from "../../utils/normalize";
import { patientService } from "../patients/patientService";

// Confirmed rules from the real backend (Doctors Postman collection):
// - GET /consultations only returns the doctor's own assigned consultations.
// - GET /consultations/:id — returns 403 if the doctor is not assigned to
//   that consultation.
// - PUT /consultations/:id/clinical — only works while the consultation is
//   in "Scheduled" status (never again once it becomes Completed).
//   "diagnosis" is required, other fields are optional. As soon as it
//   succeeds, the backend itself sets the status to "Completed" — there
//   is no "draft save" concept.
// - The doctor role has no API to "cancel" a consultation (that is an
//   admin-only action), so it isn't implemented here.

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// UI filter label -> backend "status" query value
const STATUS_MAP = {
  Upcoming: "Scheduled",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

// If the backend doesn't embed a patient object inside the consultation
// (which is confirmed — it doesn't), we best-effort fetch the patient
// detail here. If that call fails (e.g. no permission), the whole
// consultation list still doesn't crash — that consultation's patient is
// simply left "null".
async function enrichPatient(c) {
  if (c.patient) return normalizePatient(c.patient);
  if (!c.patientId) return null;
  return patientService.getPatientByIdSafe(c.patientId);
}

async function getConsultations(filter = "All") {
  const status = STATUS_MAP[filter];
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const data = await apiClient.get(`${ENDPOINTS.consultations.list}${qs}`);
  const list = Array.isArray(data) ? data : data?.consultations || [];

  let items = await Promise.all(
    list.map(async (c) => {
      const base = normalizeConsultation(c);
      const patient = await enrichPatient(base);
      return { ...base, patient };
    })
  );

  // There's no date-query on the backend for "Today's", so it's filtered
  // client-side.
  if (filter === "Today's") {
    const today = todayStr();
    items = items.filter((c) => c.date === today);
  }

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function getConsultationById(id) {
  const data = await apiClient.get(ENDPOINTS.consultations.detail(id));
  if (!data) return null;
  const base = normalizeConsultation(data);
  const patient = await enrichPatient(base);
  return { ...base, patient };
}

// Submits the consultation's clinical details (chief complaint, diagnosis,
// advice, etc). Diagnosis is required — the backend validates this too,
// but we check it here first so the user gets instant feedback.
async function submitClinicalDetails(id, form) {
  if (!form.diagnosis || !form.diagnosis.trim()) {
    throw new Error("Diagnosis is required.");
  }
  const payload = {
    chief_complaint: form.chiefComplaint || "",
    medical_history: form.medicalHistory || "",
    examination_notes: form.examination || "",
    diagnosis: form.diagnosis,
    consultation_notes: form.notes || "",
    advice: form.advice || "",
    follow_up_recommendation: form.followUp || "",
  };
  return apiClient.put(ENDPOINTS.consultations.clinical(id), payload);
}

export const consultationService = {
  getConsultations,
  getConsultationById,
  submitClinicalDetails,
};
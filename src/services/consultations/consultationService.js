import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizeConsultation, normalizePatient } from "../../utils/normalize";
import { patientService } from "../patients/patientService";

// Real backend (Doctors Postman collection) ke confirmed rules:
// - GET /consultations sirf doctor ki apni assigned consultations deta hai.
// - GET /consultations/:id — agar doctor us consultation mein assigned
//   nahi hai to 403 aata hai.
// - PUT /consultations/:id/clinical — sirf "Scheduled" status wali
//   consultation pe chal sakta hai (ek baar Completed hone ke baad
//   dobara nahi). "diagnosis" required hai, baaki fields optional.
//   Success milte hi backend khud status ko "Completed" kar deta hai
//   — isme koi "draft save" concept nahi hai.
// - Doctor role ke paas consultation "cancel" karne ka koi API nahi
//   hai (woh admin-only action hai), isliye yahan implement nahi kiya.

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// UI filter label -> backend "status" query value
const STATUS_MAP = {
  Upcoming: "Scheduled",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

// Agar backend consultation ke andar patient object embed nahi karta
// (jo ki confirmed hai — nahi karta), to yahan best-effort tareeke se
// patient detail fetch karte hain. Agar woh call fail ho jaaye (jaise
// permission na ho), to bhi poori consultation list crash nahi hoti —
// bas us consultation ka patient "null" reh jaata hai.
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

  // "Today's" ke liye backend mein date-query nahi hai, isliye
  // client-side filter karte hain.
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

// Consultation clinical details (chief complaint, diagnosis, advice, etc.)
// submit karne ke liye. Diagnosis required hai — backend isko validate
// karta hai, lekin hum bhi UI mein pehle hi check kar lete hain taaki
// user ko turant pata chal jaaye.
async function submitClinicalDetails(id, form) {
  if (!form.diagnosis || !form.diagnosis.trim()) {
    throw new Error("Diagnosis likhna zaroori hai.");
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
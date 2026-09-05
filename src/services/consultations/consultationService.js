import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizeConsultation, normalizePatient } from "../../utils/normalize";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function getConsultations(filter = "All") {
  const data = await apiClient.get(ENDPOINTS.consultations.list);
  const list = Array.isArray(data) ? data : data?.consultations || [];
  let items = list.map((c) => {
    const patient = c.patient ? normalizePatient(c.patient) : null;
    return normalizeConsultation(c, patient);
  });

  const today = todayStr();
  if (filter === "Today's") items = items.filter((c) => c.date === today);
  else if (filter === "Upcoming") items = items.filter((c) => c.status === "Scheduled");
  else if (filter === "Completed") items = items.filter((c) => c.status === "Completed");
  else if (filter === "Cancelled") items = items.filter((c) => c.status === "Cancelled");

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function getConsultationById(id) {
  const data = await apiClient.get(ENDPOINTS.consultations.detail(id));
  if (!data) return null;
  const patient = data.patient ? normalizePatient(data.patient) : null;
  return normalizeConsultation(data, patient);
}

// Consultation clinical details (chief complaint, diagnosis, advice, etc.)
// submit/update karne ke liye. "complete" flag consultation ko completed
// mark karne ke liye backend ko bhi bhej diya jata hai (agar backend
// support karta hai to woh status update kar dega).
async function saveConsultation(id, form, { asDraft = false, complete = false } = {}) {
  const payload = {
    chief_complaint: form.chiefComplaint || "",
    medical_history: form.medicalHistory || "",
    examination_notes: form.examination || "",
    diagnosis: form.diagnosis || "",
    consultation_notes: form.notes || "",
    advice: form.advice || "",
    follow_up_recommendation: form.followUp || "",
    ...(complete ? { status: "Completed" } : {}),
    ...(asDraft ? { is_draft: true } : {}),
  };
  const data = await apiClient.put(ENDPOINTS.consultations.clinical(id), payload);
  return data;
}

async function cancelConsultation(id, reason = "") {
  return apiClient.put(ENDPOINTS.consultations.cancel(id), reason ? { reason } : {});
}

export const consultationService = {
  getConsultations,
  getConsultationById,
  saveConsultation,
  cancelConsultation,
};

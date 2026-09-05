import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizePatient, normalizeConsultation } from "../../utils/normalize";
import { prescriptionStorage } from "../../utils/storage";

async function getPatients(query = "") {
  const qs = query ? `?search=${encodeURIComponent(query)}` : "";
  const data = await apiClient.get(`${ENDPOINTS.patients.list}${qs}`);
  const list = Array.isArray(data) ? data : data?.patients || [];
  let patients = list.map(normalizePatient);

  // Backend search support pakka nahi hai, isliye ek client-side
  // safety filter bhi laga diya taaki search hamesha kaam kare.
  if (query) {
    const q = query.toLowerCase();
    patients = patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q) ||
        p.mobile?.includes(q)
    );
  }
  return patients;
}

async function getPatientById(id) {
  const data = await apiClient.get(ENDPOINTS.patients.detail(id));
  return normalizePatient(data);
}

async function getPatientConsultations(id) {
  // Koi dedicated "consultations by patient" endpoint nahi hai,
  // isliye poori list leke patient ke hisaab se filter karte hain.
  const data = await apiClient.get(ENDPOINTS.consultations.list);
  const list = Array.isArray(data) ? data : data?.consultations || [];
  return list
    .map((c) => normalizeConsultation(c))
    .filter((c) => String(c.patientId) === String(id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Prescriptions ke liye backend mein abhi koi API nahi hai
// (Admin ke Postman collection mein prescription route hi nahi hai),
// isliye yeh feature filhaal locally store hoti hai.
async function getPatientPrescriptions(id) {
  const all = prescriptionStorage.getAll();
  return all
    .filter((p) => String(p.patientId) === String(id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const patientService = {
  getPatients,
  getPatientById,
  getPatientConsultations,
  getPatientPrescriptions,
};

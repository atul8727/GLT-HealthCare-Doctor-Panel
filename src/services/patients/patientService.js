import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizePatient, normalizeConsultation } from "../../utils/normalize";
import { prescriptionStorage } from "../../utils/storage";

// Chhota sa in-memory cache — same patient baar baar (jaise consultation
// list ke har row ke liye) fetch karne se bachata hai, aur agar backend
// permission (403) de raha ho to baar baar wahi failing request nahi
// dohrata within a single page load.
const patientCache = new Map();

function isValidId(id) {
  return id !== undefined && id !== null && id !== "" && id !== "undefined" && id !== "null";
}

async function getPatients(query = "") {
  const qs = query ? `?search=${encodeURIComponent(query)}` : "";
  const data = await apiClient.get(`${ENDPOINTS.patients.list}${qs}`);
  const list = Array.isArray(data) ? data : data?.patients || [];
  let patients = list.map(normalizePatient);
  patients.forEach((p) => patientCache.set(String(p.id), p));

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
  if (!isValidId(id)) return null;
  const key = String(id);
  if (patientCache.has(key)) return patientCache.get(key);
  const data = await apiClient.get(ENDPOINTS.patients.detail(id));
  const patient = normalizePatient(data);
  patientCache.set(key, patient);
  return patient;
}

// Consultation list mein agar backend patient object embed nahi karta,
// to yeh helper best-effort tareeke se patient detail fetch karta hai —
// aur agar permission na ho (403) to poori list crash nahi hoti, bas
// us consultation ka patient "null" reh jaata hai.
async function getPatientByIdSafe(id) {
  try {
    return await getPatientById(id);
  } catch {
    return null;
  }
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
  getPatientByIdSafe,
  getPatientConsultations,
  getPatientPrescriptions,
};

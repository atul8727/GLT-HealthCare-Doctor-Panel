import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizePatient, normalizeConsultation } from "../../utils/normalize";
import { prescriptionService } from "../prescriptions/prescriptionService";

// Chhota sa in-memory cache — same patient baar baar (jaise consultation
// list ke har row ke liye) fetch karne se bachata hai, aur agar backend
// permission (403) de raha ho to baar baar wahi failing request nahi
// dohrata within a single page load.
const patientCache = new Map();

function isValidId(id) {
  return id !== undefined && id !== null && id !== "" && id !== "undefined" && id !== "null";
}

// Doctor role ke liye plain GET /patients 403 deta hai (woh admin-only
// hai) — doctor apne assigned patients "/patients/my-patients" se
// dekhta hai.
//
// Patient object mein khud "last consultation date" nahi aata, isliye
// consultations list se khud compute karte hain (per-patient sabse
// recent consultation date).
async function getPatients(query = "") {
  const [patientsData, consultationsData] = await Promise.all([
    apiClient.get(ENDPOINTS.patients.myPatients),
    apiClient.get(ENDPOINTS.consultations.list).catch(() => []),
  ]);

  const list = Array.isArray(patientsData) ? patientsData : patientsData?.patients || [];
  let patients = list.map(normalizePatient);
  patients.forEach((p) => patientCache.set(String(p.id), p));

  const consultationList = Array.isArray(consultationsData)
    ? consultationsData
    : consultationsData?.consultations || [];
  const lastConsultationByPatient = new Map();
  consultationList.forEach((c) => {
    const norm = normalizeConsultation(c);
    if (!norm.patientId || !norm.date) return;
    const key = String(norm.patientId);
    const existing = lastConsultationByPatient.get(key);
    if (!existing || new Date(norm.date) > new Date(existing)) {
      lastConsultationByPatient.set(key, norm.date);
    }
  });
  patients = patients.map((p) => ({
    ...p,
    lastConsultationDate: lastConsultationByPatient.get(String(p.id)) || p.lastConsultationDate || null,
  }));
  patients.forEach((p) => patientCache.set(String(p.id), p));

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

// Ab real API se aata hai — GET /prescriptions/patient/:patientId.
async function getPatientPrescriptions(id) {
  return prescriptionService.getPatientPrescriptions(id);
}

export const patientService = {
  getPatients,
  getPatientById,
  getPatientByIdSafe,
  getPatientConsultations,
  getPatientPrescriptions,
};

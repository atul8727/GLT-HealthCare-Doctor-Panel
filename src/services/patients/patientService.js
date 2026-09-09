import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizePatient, normalizeConsultation } from "../../utils/normalize";
import { prescriptionService } from "../prescriptions/prescriptionService";

// A small in-memory cache — avoids re-fetching the same patient repeatedly
// (e.g. for every row of a consultation list), and if the backend returns
// a permission error (403), avoids repeating that same failing request
// over and over within a single page load.
const patientCache = new Map();

function isValidId(id) {
  return id !== undefined && id !== null && id !== "" && id !== "undefined" && id !== "null";
}

// Plain GET /patients returns 403 for the doctor role (admin-only) — a
// doctor views their assigned patients via "/patients/my-patients".
//
// The patient object itself doesn't include a "last consultation date",
// so we compute it ourselves from the consultations list (the most
// recent consultation date per patient).
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
      (p) => p.name?.toLowerCase().includes(q) || p.mobile?.includes(q)
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

// Best-effort patient detail fetch for when the backend doesn't embed a
// patient object in the consultation list — and if permission is denied
// (403), the whole list still doesn't crash, that consultation's patient
// is simply left "null".
async function getPatientByIdSafe(id) {
  try {
    return await getPatientById(id);
  } catch {
    return null;
  }
}

async function getPatientConsultations(id) {
  // There's no dedicated "consultations by patient" endpoint, so we fetch
  // the full list and filter it by patient.
  const data = await apiClient.get(ENDPOINTS.consultations.list);
  const list = Array.isArray(data) ? data : data?.consultations || [];
  return list
    .map((c) => normalizeConsultation(c))
    .filter((c) => String(c.patientId) === String(id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Now comes from the real API — GET /prescriptions/patient/:patientId.
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

import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizeVitals } from "../../utils/normalize";

// Vitals ab pura real backend API se aata/jaata hai (Admin ke
// Postman collection: recordVitals, updateVitals, getPatientVitals,
// getConsultationVitals, getVitalsById).

function computeBmi(weightKg, heightCm) {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  if (!w || !h) return undefined;
  const meters = h / 100;
  return Number((w / (meters * meters)).toFixed(1));
}

async function recordVitals(patientId, vitals, { consultationId, recordedBy } = {}) {
  const payload = {
    patient_id: patientId,
    ...(consultationId ? { consultation_id: consultationId } : {}),
    blood_pressure: vitals.bp,
    pulse_rate: vitals.pulse ? Number(vitals.pulse) : undefined,
    temperature: vitals.temperature ? Number(vitals.temperature) : undefined,
    spo2: vitals.spo2 ? Number(vitals.spo2) : undefined,
    weight: vitals.weight ? Number(vitals.weight) : undefined,
    height: vitals.height ? Number(vitals.height) : undefined,
    bmi: vitals.bmi ? Number(vitals.bmi) : computeBmi(vitals.weight, vitals.height),
    ...(recordedBy ? { recorded_by: recordedBy } : {}),
  };
  const data = await apiClient.post(ENDPOINTS.vitals.create, payload);
  return normalizeVitals(data);
}

async function updateVitals(id, vitals) {
  const payload = {
    blood_pressure: vitals.bp,
    pulse_rate: vitals.pulse ? Number(vitals.pulse) : undefined,
    temperature: vitals.temperature ? Number(vitals.temperature) : undefined,
    spo2: vitals.spo2 ? Number(vitals.spo2) : undefined,
    weight: vitals.weight ? Number(vitals.weight) : undefined,
    height: vitals.height ? Number(vitals.height) : undefined,
    bmi: vitals.bmi ? Number(vitals.bmi) : computeBmi(vitals.weight, vitals.height),
  };
  const data = await apiClient.put(ENDPOINTS.vitals.update(id), payload);
  return normalizeVitals(data);
}

async function getVitalsById(id) {
  const data = await apiClient.get(ENDPOINTS.vitals.detail(id));
  return normalizeVitals(data);
}

async function getPatientVitals(patientId) {
  const data = await apiClient.get(ENDPOINTS.vitals.byPatient(patientId));
  const list = Array.isArray(data) ? data : data?.vitals || [];
  return list.map(normalizeVitals).sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function getConsultationVitals(consultationId) {
  const data = await apiClient.get(ENDPOINTS.vitals.byConsultation(consultationId));
  const list = Array.isArray(data) ? data : data?.vitals || (data ? [data] : []);
  return list.map(normalizeVitals);
}

export const vitalsService = {
  recordVitals,
  updateVitals,
  getVitalsById,
  getPatientVitals,
  getConsultationVitals,
};

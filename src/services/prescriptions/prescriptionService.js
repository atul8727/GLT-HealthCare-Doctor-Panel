import { mockDelay } from "../mockDelay";
import { prescriptionStorage } from "../../utils/storage";
import { patientService } from "../patients/patientService";

// Backend (admin ke Postman collection) mein Prescription ke liye
// koi API endpoint hi nahi diya gaya hai, isliye yeh feature filhaal
// sirf is browser mein locally store hota hai. Jaise hi backend team
// prescription ka REST endpoint deti hai, bas neeche wale functions
// ko apiClient.post/get calls se replace kar dena — baaki UI pages
// mein kuch badalne ki zaroorat nahi padegi.

async function attachPatient(rx) {
  try {
    const patient = await patientService.getPatientById(rx.patientId);
    return { ...rx, patient };
  } catch {
    return rx;
  }
}

async function getPrescriptions() {
  const list = prescriptionStorage
    .getAll()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const withPatients = await Promise.all(list.map(attachPatient));
  return mockDelay(withPatients);
}

async function getPrescriptionById(id) {
  const rx = prescriptionStorage.getAll().find((x) => x.id === id);
  if (!rx) return mockDelay(null);
  const patient = await patientService.getPatientById(rx.patientId).catch(() => null);
  return mockDelay({ ...rx, patient });
}

async function createPrescription(payload) {
  const all = prescriptionStorage.getAll();
  const year = new Date().getFullYear();
  const seq = String(1000 + all.length + 1).slice(-5);
  const id = `RX-${year}-${seq}`;
  const newRx = {
    id,
    date: new Date().toISOString().slice(0, 10),
    status: "Generated",
    ...payload,
  };
  all.push(newRx);
  prescriptionStorage.setAll(all);
  return mockDelay(newRx);
}

export const prescriptionService = { getPrescriptions, getPrescriptionById, createPrescription };

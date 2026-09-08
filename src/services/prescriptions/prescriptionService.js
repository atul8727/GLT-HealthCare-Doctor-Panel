import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizePrescription } from "../../utils/normalize";

// Ab prescriptions bhi pura real backend API se aati/jaati hain
// ("Doctors" Postman collection). Important backend rules:
// - Prescription hamesha ek consultation se create hoti hai, aur
//   sirf tabhi ban sakti hai jab consultation "Completed" ho chuki ho.
// - Ek consultation ki sirf ek hi prescription ho sakti hai.
// - "diagnosis" prescription ka field nahi hai — woh consultation ke
//   clinical details mein already store hota hai.

function isNotFound(err) {
  return err?.status === 404 || /no prescription found/i.test(err?.message || "");
}

// Agar us consultation ki abhi tak koi prescription nahi bani, to
// backend "success:false, No prescription found..." deta hai — usko
// error ki jagah simply "null" treat karte hain (normal/expected state).
async function getConsultationPrescription(consultationId) {
  try {
    const data = await apiClient.get(ENDPOINTS.prescriptions.byConsultation(consultationId));
    return normalizePrescription(data);
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

async function getPrescriptionById(id) {
  const data = await apiClient.get(ENDPOINTS.prescriptions.byId(id));
  return normalizePrescription(data);
}

async function getPatientPrescriptions(patientId) {
  try {
    const data = await apiClient.get(ENDPOINTS.prescriptions.byPatient(patientId));
    const list = Array.isArray(data) ? data : data?.prescriptions || [];
    return list.map(normalizePrescription).sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    if (isNotFound(err)) return [];
    throw err;
  }
}

async function createPrescription(consultationId, form) {
  const medicines = (form.medicines || [])
    .filter((m) => m.name?.trim())
    .map((m) => ({
      medicine_name: m.name,
      dosage: m.dosage || "",
      frequency: m.frequency || "",
      duration: m.duration || "",
      instructions: m.instructions || "",
    }));

  if (medicines.length === 0) {
    throw new Error("Kam se kam ek medicine add karna zaroori hai.");
  }

  const payload = {
    tests_recommended: form.testsRecommended || "",
    additional_advice: form.additionalAdvice || "",
    ...(form.followUpDate ? { follow_up_date: form.followUpDate } : {}),
    medicines,
  };

  const data = await apiClient.post(ENDPOINTS.prescriptions.create(consultationId), payload);
  return normalizePrescription(data);
}

export const prescriptionService = {
  getConsultationPrescription,
  getPrescriptionById,
  getPatientPrescriptions,
  createPrescription,
};

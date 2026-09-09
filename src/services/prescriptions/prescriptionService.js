import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { normalizePrescription } from "../../utils/normalize";

// Prescriptions now also come from/go to the real backend API entirely
// ("Doctors" Postman collection). Important backend rules:
// - A prescription is always created from a consultation, and only once
//   that consultation has been "Completed".
// - A consultation can only have one prescription.
// - "diagnosis" is not a field of the prescription — it is already stored
//   in the consultation's clinical details.

function isNotFound(err) {
  return err?.status === 404 || /no prescription found/i.test(err?.message || "");
}

// If a consultation doesn't have a prescription yet, the backend returns
// "success:false, No prescription found...". We treat that as "null"
// rather than an error, since that's a normal/expected state.
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
    throw new Error("At least one medicine must be added.");
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

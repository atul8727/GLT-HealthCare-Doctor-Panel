import { patientService } from "../patients/patientService";
import { consultationService } from "../consultations/consultationService";

// The backend has no dedicated "stats" endpoint for the dashboard, so we
// fetch the real patients + consultations data ourselves and compute
// stats/aggregations client-side (no localStorage is used anywhere here).

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function getStats() {
  // Both calls are tried independently — if the patients list fails due
  // to a permission error (403), the consultation-based stats
  // (today's/upcoming/completed) will still show.
  const [consultationsResult, patientsResult] = await Promise.allSettled([
    consultationService.getConsultations("All"),
    patientService.getPatients(),
  ]);
  const consultations = consultationsResult.status === "fulfilled" ? consultationsResult.value : [];
  const patients = patientsResult.status === "fulfilled" ? patientsResult.value : [];
  const today = todayStr();
  return {
    todaysConsultations: consultations.filter((c) => c.date === today).length,
    upcomingConsultations: consultations.filter((c) => c.status === "Scheduled").length,
    completedConsultations: consultations.filter((c) => c.status === "Completed").length,
    myPatients: patients.length,
  };
}

async function getTodaysConsultations() {
  const consultations = await consultationService.getConsultations("Today's");
  return consultations;
}

async function getNextConsultation() {
  const today = todayStr();
  const consultations = await consultationService.getConsultations("All");
  const next = consultations
    .filter((c) => c.date === today && c.status !== "Completed" && c.status !== "Cancelled")
    .sort((a, b) => String(a.time).localeCompare(String(b.time)))[0];
  return next || null;
}

async function getRecentPatients() {
  const patients = await patientService.getPatients();
  return [...patients]
    .sort((a, b) => new Date(b.lastConsultationDate || 0) - new Date(a.lastConsultationDate || 0))
    .slice(0, 3);
}

export const dashboardService = {
  getStats,
  getTodaysConsultations,
  getNextConsultation,
  getRecentPatients,
};

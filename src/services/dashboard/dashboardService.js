import { patientService } from "../patients/patientService";
import { consultationService } from "../consultations/consultationService";

// Backend mein dashboard ke liye koi dedicated "stats" endpoint nahi hai,
// isliye real patients + consultations data khud fetch karke, client-side
// hi stats/aggregations nikaal lete hain (localStorage kahin use nahi ho raha).

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function getStats() {
  const [consultations, patients] = await Promise.all([
    consultationService.getConsultations("All"),
    patientService.getPatients(),
  ]);
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

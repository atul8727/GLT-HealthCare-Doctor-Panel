// ─────────────────────────────────────────────────────────────
// CENTRAL API CONFIG
// ─────────────────────────────────────────────────────────────
// The whole app (login, patients, vitals, consultations, prescriptions,
// doctor profile) is connected to the real backend (GLT Healthcare API).
// No localStorage/mock data is used anywhere.
// ─────────────────────────────────────────────────────────────

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://glt.fctesting.shop/api";

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE
// ─────────────────────────────────────────────────────────────
// All data (patients, consultations, vitals, prescriptions, doctor
// profile) now comes from the real backend API. Only the login session
// (JWT token + user) lives in local storage here — this is normal, every
// real app keeps its session in the browser this way; it isn't "mock
// data".
// ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "glt_doctor_token";
const USER_KEY = "glt_doctor_user";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
};

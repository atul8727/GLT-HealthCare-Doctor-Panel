// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE
// ─────────────────────────────────────────────────────────────
// Ab poora data (patients, consultations, vitals, prescriptions,
// doctor profile) real backend API se aata hai. Yahan sirf login
// session (JWT token + user) local storage mein rehta hai — yeh
// normal hai, har real app apna session isi tarah browser mein
// rakhti hai, isse "mock data" nahi kehte.
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

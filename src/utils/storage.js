// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE
// ─────────────────────────────────────────────────────────────
// Poora fake/mock "database" (doctor, patients, consultations)
// yahan se hata diya gaya hai — ab woh sab real backend API se
// aata hai (dekho: services/*).
//
// Yahan sirf do cheezein local storage mein rehti hain:
//  1. authStorage → login token/user session (yeh normal hai,
//     har real app apna JWT session isi tarah browser mein
//     rakhti hai, isse "mock data" nahi kehte).
//  2. prescriptionStorage → sirf Prescriptions ke liye, kyunki
//     backend (admin ke Postman collection) mein abhi prescription
//     ka koi API endpoint hi provide nahi kiya gaya hai. Jaise hi
//     backend team prescription API deti hai, is file ko hata ke
//     services/prescriptions/prescriptionService.js ko seedha
//     apiClient se point kar dena.
// ─────────────────────────────────────────────────────────────

function uid(prefix = "ID") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

// ── Auth session (JWT token + logged-in user) ──
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

// ── Prescriptions (local-only, no backend endpoint available yet) ──
const RX_KEY = "glt_doctor_prescriptions";

function readRx() {
  try {
    const raw = localStorage.getItem(RX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeRx(list) {
  localStorage.setItem(RX_KEY, JSON.stringify(list));
}

export const prescriptionStorage = {
  getAll: readRx,
  setAll: writeRx,
  clearAll: () => writeRx([]),
  uid,
};

// ─────────────────────────────────────────────────────────────
// CENTRAL API CONFIG
// ─────────────────────────────────────────────────────────────
// App ab real backend (GLT Healthcare API) se connected hai.
// USE_MOCK sirf un features ke liye hai jinke liye backend mein
// abhi koi API endpoint hi maujood nahi hai (jaise Prescriptions -
// admin ke Postman collection mein prescription ka koi route
// nahi hai), isliye woh feature filhaal local storage par chalta
// rahega jab tak backend team koi endpoint nahi deti.
//
// Baaki sab kuch (login, patients, vitals, consultations, doctor
// profile) real API se connect hai — koi localStorage/mock data
// nahi use ho raha.
// ─────────────────────────────────────────────────────────────

// Global flag ab false hai — sirf reference/backward-compat ke liye rakha hai.
export const USE_MOCK = false;

// Sirf prescriptions module ke liye (backend mein API available nahi hai).
export const USE_MOCK_PRESCRIPTIONS = true;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://glt.fctesting.shop/api";

// Fake network delay — sirf mock (prescriptions) ke liye "loading" feel dene ke liye.
export const MOCK_DELAY_MS = 300;

// ─────────────────────────────────────────────────────────────
// CENTRAL API CLIENT (REST)
// Saare real backend calls yahin se guzarte hain — base URL, auth
// token (Bearer), headers, response envelope aur error handling
// sab ek hi jagah handle hota hai.
//
// Backend response ka shape hamesha aisa aata hai:
//   { success: true/false, message: "...", data: {...} }
// Yeh client automatically "data" ko unwrap karke return karta hai.
// ─────────────────────────────────────────────────────────────
import { API_BASE_URL } from "../config/api";
import { authStorage } from "../utils/storage";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = authStorage.getToken();

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Server se connect nahi ho paya. Apna internet ya API URL check karein.");
  }

  // Session expire ho gaya / token invalid hai
  if (res.status === 401) {
    authStorage.clearToken();
    authStorage.clearUser();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please login again.");
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    // no/invalid JSON body
  }

  if (!res.ok || json?.success === false) {
    const message =
      res.status === 403
        ? json?.message ||
          "Permission denied: aapke doctor account ko is data ko access karne ki permission server par abhi allow nahi hai. Backend/admin team se apne role ke liye is API ko allow karwane ko kahein."
        : json?.message || `API Error: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  // Backend envelope { success, message, data } -> sirf "data" return karo
  return json && Object.prototype.hasOwnProperty.call(json, "data") ? json.data : json;
}

export const apiClient = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};

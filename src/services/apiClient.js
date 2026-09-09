// ─────────────────────────────────────────────────────────────
// CENTRAL API CLIENT (REST)
// All real backend calls go through here — base URL, auth token
// (Bearer), headers, response envelope, and error handling are all
// handled in one place.
//
// The backend response shape is always:
//   { success: true/false, message: "...", data: {...} }
// This client automatically unwraps and returns "data".
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
    throw new Error("Could not connect to the server. Please check your internet or the API URL.");
  }

  // Session expired / token invalid
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
          "Permission denied: your doctor account does not currently have permission to access this data on the server. Please ask your backend/admin team to enable this API for your role."
        : json?.message || `API Error: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  // Backend envelope { success, message, data } -> return only "data"
  return json && Object.prototype.hasOwnProperty.call(json, "data") ? json.data : json;
}

export const apiClient = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};

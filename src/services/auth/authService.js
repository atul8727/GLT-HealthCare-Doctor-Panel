import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { authStorage } from "../../utils/storage";
import { normalizeDoctor } from "../../utils/normalize";

// Login always goes through the real backend (POST /auth/login).
// No hardcoded/mock credentials are accepted — only the email/password
// the admin gave when creating the doctor account will work.
async function login(email, password) {
  const data = await apiClient.post(ENDPOINTS.auth.login, {
    email,
    password,
    role: "doctor",
  });

  const rawUser = data?.user || {};
  const user = normalizeDoctor(rawUser);

  // Extra safety: if the backend ever returns a token for a non-doctor
  // account, don't allow login into the doctor panel.
  const role = (rawUser.role || "").toLowerCase();
  if (role && role !== "doctor") {
    throw new Error("This account is not authorized for the Doctor Portal.");
  }

  if (!data?.token) {
    throw new Error("No token was returned in the login response.");
  }

  authStorage.setToken(data.token);
  authStorage.setUser(user);
  return { token: data.token, user };
}

function logout() {
  authStorage.clearToken();
  authStorage.clearUser();
}

function getCurrentUser() {
  return authStorage.getUser();
}

function isAuthenticated() {
  return !!authStorage.getToken();
}

export const authService = { login, logout, getCurrentUser, isAuthenticated };

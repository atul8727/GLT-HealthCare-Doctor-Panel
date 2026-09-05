import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { authStorage } from "../../utils/storage";
import { normalizeDoctor } from "../../utils/normalize";

// Login hamesha real backend (POST /auth/login) se hota hai.
// Koi hardcoded/mock credential accept nahi hoti — jo email/password
// admin ne doctor account banate waqt diya hai, sirf wahi login
// karega.
async function login(email, password) {
  const data = await apiClient.post(ENDPOINTS.auth.login, {
    email,
    password,
    role: "doctor",
  });

  const rawUser = data?.user || {};
  const user = normalizeDoctor(rawUser);

  // Extra safety: agar backend ne kisi wajah se non-doctor account
  // ka token de bhi diya, to doctor panel mein login nahi hone denge.
  const role = (rawUser.role || "").toLowerCase();
  if (role && role !== "doctor") {
    throw new Error("Yeh account Doctor Portal ke liye authorized nahi hai.");
  }

  if (!data?.token) {
    throw new Error("Login response mein token nahi mila.");
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

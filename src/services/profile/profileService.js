import { ENDPOINTS } from "../../config/endpoints";
import { apiClient } from "../apiClient";
import { authStorage } from "../../utils/storage";
import { normalizeDoctor } from "../../utils/normalize";

function currentDoctorId() {
  const user = authStorage.getUser();
  if (!user?.id) throw new Error("Doctor session not found. Please login again.");
  return user.id;
}

async function getProfile() {
  const id = currentDoctorId();
  const data = await apiClient.get(ENDPOINTS.doctors.detail(id));
  const user = normalizeDoctor(data);
  authStorage.setUser(user);
  return user;
}

// Backend ka updateDoctor endpoint sirf name, mobile aur
// specialization accept karta hai — email login-id hai isliye
// isse change nahi karwaya jaata.
async function updateProfile(updates) {
  const id = currentDoctorId();
  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.mobile !== undefined) payload.mobile = updates.mobile;
  if (updates.specialization !== undefined) payload.specialization = updates.specialization;

  const data = await apiClient.put(ENDPOINTS.doctors.detail(id), payload);
  const user = normalizeDoctor({ ...authStorage.getUser(), ...data });
  authStorage.setUser(user);
  return user;
}

async function changePassword(newPassword) {
  const id = currentDoctorId();
  return apiClient.put(ENDPOINTS.doctors.password(id), { password: newPassword });
}

export const profileService = { getProfile, updateProfile, changePassword };

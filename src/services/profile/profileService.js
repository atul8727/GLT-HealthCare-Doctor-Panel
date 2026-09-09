import { authStorage } from "../../utils/storage";

// The "Doctors" Postman collection (what's actually available with a
// doctor-role token) has no endpoint for a doctor to GET/UPDATE their own
// profile or change their password — that's all admin-only. So we don't
// make a network call here (which would always return 403); instead we
// show the info already received at login (name, email, doctor_id, role).

async function getProfile() {
  return authStorage.getUser();
}

async function updateProfile() {
  throw new Error(
    "Profile editing isn't currently available from the doctor account — it is updated via the admin."
  );
}

async function changePassword() {
  throw new Error(
    "Password changes aren't currently available from the doctor account — please ask your admin/clinic to set a new password."
  );
}

export const profileService = { getProfile, updateProfile, changePassword };

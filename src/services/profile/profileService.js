import { authStorage } from "../../utils/storage";

// "Doctors" Postman collection (jo doctor-role token se actually
// available hai) mein doctor apni profile GET/UPDATE karne ya
// password change karne ka koi endpoint hi nahi hai — woh sab
// admin-only hai. Isliye yahan network call nahi lagate (jo hamesha
// 403 dega), balki jo info login response mein already mil chuki
// hai (name, email, doctor_id, role) usi se profile dikhate hain.

async function getProfile() {
  return authStorage.getUser();
}

async function updateProfile() {
  throw new Error(
    "Profile edit filhaal doctor account se available nahi hai — yeh admin ke through update hoti hai."
  );
}

async function changePassword() {
  throw new Error(
    "Password change filhaal doctor account se available nahi hai — apne admin/clinic se naya password set karwayein."
  );
}

export const profileService = { getProfile, updateProfile, changePassword };

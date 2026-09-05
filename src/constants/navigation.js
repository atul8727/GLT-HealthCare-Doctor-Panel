import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiClipboard,
  FiUser,
  FiSettings,
} from "react-icons/fi";

export const MAIN_NAV = [
  { label: "Dashboard", to: "/doctor/dashboard", icon: FiHome },
  { label: "My Patients", to: "/doctor/patients", icon: FiUsers },
  { label: "Consultations", to: "/doctor/consultations", icon: FiCalendar },
  { label: "Patient History", to: "/doctor/patient-history", icon: FiFileText },
  { label: "Prescriptions", to: "/doctor/prescriptions", icon: FiClipboard },
];

export const ACCOUNT_NAV = [
  { label: "My Profile", to: "/doctor/profile", icon: FiUser },
  { label: "Settings", to: "/doctor/settings", icon: FiSettings },
];

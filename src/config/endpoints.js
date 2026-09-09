// Real backend (GLT Healthcare API) routes.
// Taken from the "Doctors" Postman collection (only the ones actually
// available/working for the doctor role, with verified responses).
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  patients: {
    // Plain "/patients" returns 403 for the doctor role (admin-only) —
    // a doctor can only view their assigned patients via
    // "/patients/my-patients".
    myPatients: "/patients/my-patients",
    detail: (id) => `/patients/${id}`,
  },
  vitals: {
    create: "/vitals/",
    detail: (id) => `/vitals/${id}`,
    update: (id) => `/vitals/${id}`,
    byPatient: (patientId) => `/vitals/patient/${patientId}`,
    byConsultation: (consultationId) => `/vitals/consultation/${consultationId}`,
  },
  consultations: {
    list: "/consultations",
    detail: (id) => `/consultations/${id}`,
    clinical: (id) => `/consultations/${id}/clinical`,
  },
  prescriptions: {
    // A prescription is always linked to a consultation (can only be
    // created once the consultation has become Completed).
    create: (consultationId) => `/prescriptions/consultation/${consultationId}`,
    byConsultation: (consultationId) => `/prescriptions/consultation/${consultationId}`,
    byId: (id) => `/prescriptions/${id}`,
    byPatient: (patientId) => `/prescriptions/patient/${patientId}`,
  },
};

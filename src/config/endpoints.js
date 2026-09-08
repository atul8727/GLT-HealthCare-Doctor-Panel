// Real backend (GLT Healthcare API) ke actual routes.
// "Doctors" Postman collection (doctor-role ke liye jo actually
// available/working hain, verified responses ke saath) se liye gaye hain.
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  patients: {
    // Doctor role ke liye plain "/patients" 403 deta hai (woh admin-only hai) —
    // doctor sirf apne assigned patients "/patients/my-patients" se dekh sakta hai.
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
    // Prescription hamesha ek consultation se linked hoti hai (consultation
    // ko Completed hone ke baad hi ban sakti hai).
    create: (consultationId) => `/prescriptions/consultation/${consultationId}`,
    byConsultation: (consultationId) => `/prescriptions/consultation/${consultationId}`,
    byId: (id) => `/prescriptions/${id}`,
    byPatient: (patientId) => `/prescriptions/patient/${patientId}`,
  },
};

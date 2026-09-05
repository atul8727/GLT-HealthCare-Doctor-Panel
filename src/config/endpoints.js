// Real backend (GLT Healthcare API) ke actual routes.
// Admin ke Postman collection (Admin.postman_collection.json) se liye gaye hain.
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  doctors: {
    // Doctor apni khud ki profile GET/UPDATE karta hai isi id se (login response ka doctor_id).
    detail: (id) => `/doctors/${id}`,
    password: (id) => `/doctors/${id}/password`,
  },
  patients: {
    list: "/patients",
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
    cancel: (id) => `/consultations/${id}/cancel`,
  },
};

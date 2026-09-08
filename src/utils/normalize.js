// ─────────────────────────────────────────────────────────────
// NORMALIZERS
// ─────────────────────────────────────────────────────────────
// Real backend responses field-names mein thoda vary kar sakte
// hain (snake_case vs camelCase, id vs patient_id, etc). Yeh
// helpers backend ke response ko ek consistent shape mein convert
// karte hain jo poore doctor panel UI (components/pages) already
// expect karta hai — isse UI components mein dubara change nahi
// karna padta agar backend ka exact field-naming thoda alag nikle.
// ─────────────────────────────────────────────────────────────

function pick(obj, keys, fallback) {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== "") return obj[k];
  }
  return fallback;
}

export function normalizeDoctor(d) {
  if (!d) return null;
  return {
    id: pick(d, ["doctor_id", "id", "_id"]),
    name: pick(d, ["name"], ""),
    email: pick(d, ["email"], ""),
    mobile: pick(d, ["mobile", "phone"], ""),
    specialization: pick(d, ["specialization"], ""),
    status: pick(d, ["status"], "Active"),
    role: pick(d, ["role"], "doctor"),
  };
}

export function normalizePatient(p) {
  if (!p) return null;
  return {
    id: pick(p, ["patient_id", "id", "_id"]),
    name: pick(p, ["name"], ""),
    mobile: pick(p, ["mobile", "phone"], ""),
    dob: pick(p, ["dob"], ""),
    age: pick(p, ["age"], ""),
    gender: pick(p, ["gender"], ""),
    address: pick(p, ["address"], ""),
    email: pick(p, ["email"], ""),
    emergencyContact: pick(p, ["emergency_contact", "emergencyContact"], ""),
    registeredBy: pick(p, ["registered_by", "registeredBy"], ""),
    createdAt: pick(p, ["created_at", "createdAt"], ""),
    lastConsultationDate: pick(p, ["last_consultation_date", "lastConsultationDate"], null),
  };
}

export function normalizeVitals(v) {
  if (!v) return null;
  return {
    id: pick(v, ["vital_id", "id", "_id"]),
    patientId: pick(v, ["patient_id", "patientId"]),
    consultationId: pick(v, ["consultation_id", "consultationId"], null),
    date: pick(v, ["recorded_at", "created_at", "date", "recordedOn"], ""),
    bp: pick(v, ["blood_pressure", "bp"], ""),
    pulse: pick(v, ["pulse_rate", "pulse"], ""),
    temperature: pick(v, ["temperature", "temp"], ""),
    spo2: pick(v, ["spo2"], ""),
    weight: pick(v, ["weight"], ""),
    height: pick(v, ["height"], ""),
    bmi: pick(v, ["bmi"], ""),
    recordedBy: pick(v, ["recorded_by", "recordedBy"], null),
  };
}

export function normalizeMedicine(m) {
  if (!m) return null;
  return {
    id: pick(m, ["medicine_id", "id"], undefined),
    name: pick(m, ["medicine_name", "name"], ""),
    dosage: pick(m, ["dosage"], ""),
    frequency: pick(m, ["frequency"], ""),
    duration: pick(m, ["duration"], ""),
    instructions: pick(m, ["instructions"], ""),
  };
}

export function normalizePrescription(p) {
  if (!p) return null;
  return {
    id: pick(p, ["prescription_id", "id", "_id"]),
    consultationId: pick(p, ["consultation_id", "consultationId"]),
    patientId: pick(p, ["patient_id", "patientId"]),
    doctorId: pick(p, ["doctor_id", "doctorId"]),
    testsRecommended: pick(p, ["tests_recommended", "testsRecommended"], ""),
    additionalAdvice: pick(p, ["additional_advice", "additionalAdvice"], ""),
    followUpDate: pick(p, ["follow_up_date", "followUpDate"], ""),
    date: pick(p, ["created_at", "date"], ""),
    medicines: Array.isArray(p.medicines) ? p.medicines.map(normalizeMedicine) : [],
    patient: p.patient ? normalizePatient(p.patient) : null,
  };
}

export function normalizeConsultation(c, patient) {
  if (!c) return null;
  return {
    id: pick(c, ["consultation_id", "id", "_id"]),
    patientId: pick(c, ["patient_id", "patientId"]),
    // date: pick(c, ["date", "consultation_date", "scheduled_date"], ""),
    // time: pick(c, ["time", "scheduled_time"], ""),
    date: pick(c, ["consultation_date", "date", "scheduled_date"], ""),
    time: pick(c, ["consultation_time", "time", "scheduled_time"], ""),
    type: pick(c, ["type", "consultation_type"], "Online"),
    status: pick(c, ["status"], "Scheduled"),
    meetLink: pick(c, ["meet_link", "meetLink", "google_meet_link"], ""),
    chiefComplaint: pick(c, ["chief_complaint", "chiefComplaint"], ""),
    medicalHistory: pick(c, ["medical_history", "medicalHistory"], ""),
    examination: pick(c, ["examination_notes", "examination"], ""),
    diagnosis: pick(c, ["diagnosis"], ""),
    notes: pick(c, ["consultation_notes", "notes"], ""),
    advice: pick(c, ["advice"], ""),
    followUp: pick(c, ["follow_up_recommendation", "followUp"], ""),
    patient: patient || c.patient || null,
  };
}

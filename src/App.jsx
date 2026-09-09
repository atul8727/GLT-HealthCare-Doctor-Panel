import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DoctorLayout from "./components/layout/DoctorLayout";

import DoctorLogin from "./pages/auth/DoctorLogin";
import Dashboard from "./pages/doctor/dashboard/Dashboard";
import Patients from "./pages/doctor/patients/Patients";
import PatientDetails from "./pages/doctor/patients/PatientDetails";
import Consultations from "./pages/doctor/consultations/Consultations";
import ConsultationDetails from "./pages/doctor/consultations/ConsultationDetails";
import PatientHistory from "./pages/doctor/patient-history/PatientHistory";
import Prescriptions from "./pages/doctor/prescriptions/Prescriptions";
import CreatePrescription from "./pages/doctor/prescriptions/CreatePrescription";
import PrescriptionDetails from "./pages/doctor/prescriptions/PrescriptionDetails";
import Profile from "./pages/doctor/profile/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontSize: "14px" } }} />
        <Routes>
          <Route path="/login" element={<DoctorLogin />} />
          <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="patients" element={<Patients />} />
            <Route path="patients/:id" element={<PatientDetails />} />

            <Route path="consultations" element={<Consultations />} />
            <Route path="consultations/:id" element={<ConsultationDetails />} />

            <Route path="patient-history" element={<PatientHistory />} />

            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="prescriptions/create" element={<CreatePrescription />} />
            <Route path="prescriptions/:id" element={<PrescriptionDetails />} />

            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
